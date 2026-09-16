import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  BUDGET_BAND_RANGE,
  BUDGET_BANDS,
  CATEGORIES,
  CATEGORY_FOLLOW_UP,
  COMPLEXITIES,
  HOMEOWNER_STARTING_CENTS,
  PLATFORM_FEE_BPS,
  SAFETY_LEVELS,
  SEVERITIES,
  TIME_WINDOWS,
  TOP_UP_CENTS,
  type BidRow,
  type BudgetBand,
  type Category,
  type ChangeOrderRow,
  type Complexity,
  type DiagnosisResult,
  type DiagnosisRow,
  type DisputeRow,
  type JobRow,
  type JobStatus,
  type MessageRow,
  type MessageThread,
  type PaymentRow,
  type Profile,
  type ProReview,
  type ProSummary,
  type Role,
  type SafetyLevel,
  type Severity,
  type TimeWindow,
  type Urgency,
  type WalletEvent,
} from "@/lib/handypix-types";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function asJson<T>(value: unknown): T {
  if (value == null) return value as T;
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1;
}

function asNum(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function isTimeWindow(v: string): v is TimeWindow {
  return (TIME_WINDOWS as readonly string[]).includes(v);
}

function isBudgetBand(v: string): v is BudgetBand {
  return (BUDGET_BANDS as readonly string[]).includes(v);
}

type ProfileDb = {
  user_id: string;
  role: string;
  display_name: string;
  city: string;
  zip: string;
  bio: string;
  trades: unknown;
  hourly_rate_cents: number;
  rating_x10: number;
  jobs_completed: number;
  wallet_cents: number;
  created_at: string;
};

function mapProfile(row: ProfileDb): Profile {
  const trades = asJson<string[]>(row.trades) ?? [];
  return {
    userId: row.user_id,
    role: row.role === "pro" ? "pro" : "homeowner",
    displayName: row.display_name,
    city: row.city,
    zip: row.zip,
    bio: row.bio,
    trades: trades.filter((t): t is Category =>
      (CATEGORIES as readonly string[]).includes(t),
    ),
    hourlyRateCents: asNum(row.hourly_rate_cents),
    ratingX10: asNum(row.rating_x10),
    jobsCompleted: asNum(row.jobs_completed),
    walletCents: asNum(row.wallet_cents),
    createdAt: row.created_at,
  };
}

type JobDb = {
  id: string;
  homeowner_id: string;
  poster_name: string;
  title: string;
  description: string;
  category: string;
  photo_url: string;
  diagnosis: unknown;
  status: string;
  urgency: string;
  zip: string;
  budget_min_cents: number;
  budget_max_cents: number;
  awarded_bid_id: string | null;
  is_seed: boolean | string;
  auto_award: boolean | string;
  created_at: string;
  bid_count?: number;
  preferred_date?: string | null;
  time_window?: string;
  budget_band?: string;
  awarded_at?: string | null;
  on_the_way_at?: string | null;
  started_at?: string | null;
  work_performed?: string;
  after_photo_url?: string;
};

function mapJob(row: JobDb): JobRow {
  return {
    id: row.id,
    homeownerId: row.homeowner_id,
    posterName: row.poster_name,
    title: row.title,
    description: row.description,
    category: (CATEGORIES as readonly string[]).includes(row.category)
      ? (row.category as Category)
      : "other",
    photoUrl: row.photo_url,
    diagnosis: row.diagnosis
      ? normalizeDiagnosis(
          (asJson<Record<string, unknown>>(row.diagnosis) ?? {}) as Record<
            string,
            unknown
          >,
        )
      : null,
    status: row.status as JobStatus,
    urgency: row.urgency as Urgency,
    zip: row.zip,
    budgetMinCents: asNum(row.budget_min_cents),
    budgetMaxCents: asNum(row.budget_max_cents),
    awardedBidId: row.awarded_bid_id,
    isSeed: asBool(row.is_seed),
    autoAward: asBool(row.auto_award),
    bidCount: asNum(row.bid_count),
    createdAt: row.created_at,
    preferredDate: row.preferred_date ?? null,
    timeWindow: isTimeWindow(String(row.time_window ?? "flexible"))
      ? (row.time_window as TimeWindow)
      : "flexible",
    budgetBand: isBudgetBand(String(row.budget_band ?? "unknown"))
      ? (row.budget_band as BudgetBand)
      : "unknown",
    awardedAt: row.awarded_at ?? null,
    onTheWayAt: row.on_the_way_at ?? null,
    startedAt: row.started_at ?? null,
    workPerformed: row.work_performed ?? "",
    afterPhotoUrl: row.after_photo_url ?? "",
  };
}

type ProDb = {
  id: string;
  display_name: string;
  city: string;
  zip: string;
  trades: unknown;
  bio: string;
  hourly_rate_cents: number;
  rating_x10: number;
  jobs_completed: number;
  years_exp: number;
  identity_verified?: boolean | string;
  insurance?: boolean | string;
  background_check?: boolean | string;
  distance_miles?: number | string;
  reviews?: unknown;
};

function mapProReviews(raw: unknown): ProReview[] {
  const list = asJson<unknown[]>(raw) ?? [];
  return list
    .map((item) => {
      const o = (item ?? {}) as Record<string, unknown>;
      const tags = Array.isArray(o.tags) ? o.tags.map((t) => String(t)) : [];
      return {
        author: String(o.author ?? "Neighbor"),
        rating: Math.min(5, Math.max(1, asNum(o.rating) || 5)),
        comment: String(o.comment ?? ""),
        tags,
      };
    })
    .slice(0, 8);
}

function mapPro(row: ProDb): ProSummary {
  const trades = asJson<string[]>(row.trades) ?? [];
  return {
    id: row.id,
    displayName: row.display_name,
    city: row.city,
    zip: row.zip,
    trades: trades.filter((t): t is Category =>
      (CATEGORIES as readonly string[]).includes(t),
    ),
    bio: row.bio,
    hourlyRateCents: asNum(row.hourly_rate_cents),
    ratingX10: asNum(row.rating_x10),
    jobsCompleted: asNum(row.jobs_completed),
    yearsExp: asNum(row.years_exp),
    identityVerified: row.identity_verified == null ? true : asBool(row.identity_verified),
    insurance: row.insurance == null ? true : asBool(row.insurance),
    backgroundCheck:
      row.background_check == null ? true : asBool(row.background_check),
    distanceMiles: Math.round(asNum(row.distance_miles || 3) * 10) / 10,
    reviews: mapProReviews(row.reviews),
  };
}

async function loadPro(
  sql: Awaited<ReturnType<typeof getSql>>,
  proId: string,
): Promise<ProSummary> {
  const seed = await sql<ProDb>`
    select id, display_name, city, zip, trades, bio, hourly_rate_cents,
           rating_x10, jobs_completed, years_exp, identity_verified, insurance,
           background_check, distance_miles, reviews
    from seed_pros where id = ${proId} limit 1
  `;
  if (seed[0]) return mapPro(seed[0]);
  const real = await sql<ProfileDb>`
    select user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
           rating_x10, jobs_completed, wallet_cents, created_at
    from profiles where user_id = ${proId} limit 1
  `;
  if (real[0]) {
    const p = mapProfile(real[0]);
    const reviewRows = await sql<{
      rating: number;
      comment: string;
      tags: string;
      from_id: string;
    }>`
      select rating, comment, tags, from_id from reviews
      where to_id = ${proId} order by created_at desc limit 6
    `;
    return {
      id: p.userId,
      displayName: p.displayName,
      city: p.city,
      zip: p.zip,
      trades: p.trades,
      bio: p.bio,
      hourlyRateCents: p.hourlyRateCents,
      ratingX10: p.ratingX10 || 48,
      jobsCompleted: p.jobsCompleted,
      yearsExp: 1,
      identityVerified: true,
      insurance: false,
      backgroundCheck: false,
      distanceMiles: 2.2,
      reviews: reviewRows.map((r) => ({
        author: "Homeowner",
        rating: asNum(r.rating),
        comment: r.comment,
        tags: asJson<string[]>(r.tags) ?? [],
      })),
    };
  }
  return {
    id: proId,
    displayName: "Handyman",
    city: "Dallas",
    zip: "75201",
    trades: ["other"],
    bio: "",
    hourlyRateCents: 8000,
    ratingX10: 45,
    jobsCompleted: 0,
    yearsExp: 1,
    identityVerified: false,
    insurance: false,
    backgroundCheck: false,
    distanceMiles: 4,
    reviews: [],
  };
}

type BidDb = {
  id: string;
  job_id: string;
  pro_id: string;
  amount_cents: number;
  message: string;
  eta_days: number;
  materials_included: boolean | string;
  status: string;
  created_at: string;
  labor_cents?: number;
  materials_cents?: number;
  warranty_days?: number;
  duration_minutes?: number;
  available_window?: string;
  distance_miles?: number | string;
};

async function mapBids(
  sql: Awaited<ReturnType<typeof getSql>>,
  rows: BidDb[],
): Promise<BidRow[]> {
  const out: BidRow[] = [];
  for (const row of rows) {
    const amount = asNum(row.amount_cents);
    const labor = asNum(row.labor_cents);
    const materials = asNum(row.materials_cents);
    const pro = await loadPro(sql, row.pro_id);
    out.push({
      id: row.id,
      jobId: row.job_id,
      proId: row.pro_id,
      amountCents: amount,
      message: row.message,
      etaDays: asNum(row.eta_days),
      materialsIncluded: asBool(row.materials_included),
      status: row.status as BidRow["status"],
      createdAt: row.created_at,
      laborCents: labor || Math.round(amount * 0.78),
      materialsCents: materials || amount - Math.round(amount * 0.78),
      warrantyDays: asNum(row.warranty_days) || 30,
      durationMinutes: asNum(row.duration_minutes) || 60,
      availableWindow: row.available_window || `In ${asNum(row.eta_days) || 2} day(s)`,
      distanceMiles:
        Math.round(asNum(row.distance_miles || pro.distanceMiles) * 10) / 10,
      pro,
    });
  }
  return out;
}

async function requireProfile(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
): Promise<Profile> {
  const rows = await sql<ProfileDb>`
    select user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
           rating_x10, jobs_completed, wallet_cents, created_at
    from profiles where user_id = ${userId} limit 1
  `;
  if (!rows[0]) throw new Error("Finish setup to continue");
  return mapProfile(rows[0]);
}

function isCategory(v: string): v is Category {
  return (CATEGORIES as readonly string[]).includes(v);
}

function deriveSafety(severity: Severity, category: Category): SafetyLevel {
  if (severity === "emergency") return "danger";
  if (
    severity === "high" ||
    category === "electrical" ||
    category === "hvac" ||
    category === "roofing"
  ) {
    return "caution";
  }
  return "normal";
}

function deriveComplexity(
  diy: DiagnosisResult["diy_difficulty"],
  hours: number,
): Complexity {
  if (diy === "pro-only" || hours >= 4) return "larger";
  if (diy === "easy" || hours <= 1.5) return "small";
  return "standard";
}

function listStr(v: unknown, max = 8): string[] {
  return (Array.isArray(v) ? v : [])
    .map((x) => String(x))
    .filter(Boolean)
    .slice(0, max);
}

function normalizeDiagnosis(raw: Record<string, unknown>): DiagnosisResult {
  const category = isCategory(String(raw.category ?? "other"))
    ? (raw.category as Category)
    : "other";
  const severity = (SEVERITIES as readonly string[]).includes(String(raw.severity))
    ? (raw.severity as Severity)
    : "medium";
  const partsRaw = Array.isArray(raw.parts) ? raw.parts : [];
  const parts = partsRaw
    .map((p) => {
      const o = p as Record<string, unknown>;
      return {
        name: String(o.name ?? "Part"),
        est_cost_cents: Math.max(0, Math.round(asNum(o.est_cost_cents))),
      };
    })
    .slice(0, 8);
  const diy = ["easy", "moderate", "advanced", "pro-only"].includes(
    String(raw.diy_difficulty),
  )
    ? (raw.diy_difficulty as DiagnosisResult["diy_difficulty"])
    : "moderate";
  const hours = Math.max(0.5, asNum(raw.est_labor_hours) || 2);
  const follow = CATEGORY_FOLLOW_UP[category];
  const safety = (SAFETY_LEVELS as readonly string[]).includes(
    String(raw.safety_level),
  )
    ? (raw.safety_level as SafetyLevel)
    : deriveSafety(severity, category);
  const complexity = (COMPLEXITIES as readonly string[]).includes(
    String(raw.complexity),
  )
    ? (raw.complexity as Complexity)
    : deriveComplexity(diy, hours);
  const observations = listStr(raw.observations, 6);
  return {
    issue: String(raw.issue ?? "Household issue").slice(0, 80),
    category,
    severity,
    summary: String(raw.summary ?? "").slice(0, 800),
    likely_cause: String(raw.likely_cause ?? "").slice(0, 280),
    diy_possible: Boolean(raw.diy_possible),
    diy_difficulty: diy,
    diy_steps: listStr(raw.diy_steps),
    tools_needed: listStr(raw.tools_needed),
    parts,
    safety_notes: listStr(raw.safety_notes),
    when_to_call_pro: String(raw.when_to_call_pro ?? "").slice(0, 320),
    est_labor_hours: hours,
    est_cost_min_cents: Math.max(0, Math.round(asNum(raw.est_cost_min_cents))),
    est_cost_max_cents: Math.max(0, Math.round(asNum(raw.est_cost_max_cents))),
    confidence: Math.min(99, Math.max(20, Math.round(asNum(raw.confidence) || 70))),
    observations:
      observations.length > 0
        ? observations
        : [String(raw.likely_cause ?? "Visible wear in the photo")].filter(Boolean),
    follow_up_question: String(raw.follow_up_question ?? follow.question).slice(0, 120),
    follow_up_options: listStr(raw.follow_up_options, 4).length
      ? listStr(raw.follow_up_options, 4)
      : follow.options,
    follow_up_answer: String(raw.follow_up_answer ?? ""),
    safety_level: safety,
    complexity,
  };
}

function mapDiagnosisRow(r: {
  id: string;
  user_id: string;
  job_id: string | null;
  photo_url: string;
  photo_urls?: unknown;
  result: unknown;
  created_at: string;
}): DiagnosisRow {
  const extras = asJson<string[]>(r.photo_urls) ?? [];
  return {
    id: r.id,
    userId: r.user_id,
    jobId: r.job_id,
    photoUrl: r.photo_url,
    photoUrls: extras.length ? extras : [r.photo_url],
    result: normalizeDiagnosis(
      (asJson<Record<string, unknown>>(r.result) ?? {}) as Record<string, unknown>,
    ),
    createdAt: r.created_at,
  };
}

const BID_NOTES: Record<string, string[]> = {
  plumbing: [
    "I can inspect the connection and replace the gasket or trap if necessary. Materials included up to the bid.",
    "Same-day window if the part is on the truck. I text photos before anything extra.",
    "I warranty the work. If shutoffs are frozen I will quote that first.",
  ],
  electrical: [
    "Licensed work only. I will make the circuit safe, then replace what failed.",
    "I test the run before closing the box. Heat-damaged wire is a stop-and-quote.",
    "Code-first repair. I will not leave a device on cooked conductors.",
  ],
  hvac: [
    "Diagnosis first: airflow, amp draw, then a written fix. No surprise add-ons.",
    "I clean what is clogged and tell you if refrigerant is actually the issue.",
    "If the compressor is at risk I will shut it down and explain before quoting.",
  ],
  carpentry: [
    "I match the material, check the structure underneath, and leave it paint-ready.",
    "Clean cuts, coated fasteners, and a walkthrough of anything else that is going.",
    "I will not patch over rot. If the framing is soft I stop and show you.",
  ],
  painting: [
    "Repair, prime, and paint the whole plane so it does not flash in daylight.",
    "Dust control and a tight color match. Furniture gets covered.",
  ],
  appliance: [
    "I diagnose before ordering parts. If it is not worth fixing I will say so.",
    "Most residential brands. I test a full cycle before I call it done.",
  ],
  roofing: [
    "I find the water path from above, not just the stain. Photos on the way out.",
    "Flashing and boots first. Drywall waits until the roof is actually dry.",
  ],
  flooring: [
    "I pull enough to see the subfloor. Matching plank if I can source it today.",
  ],
  other: [
    "I will look at it in person, give you a firm number, and do the work that day if it is small.",
    "General repair. If it needs a license I will tell you and help you hire that trade.",
  ],
};

async function generateSeedBids(
  sql: Awaited<ReturnType<typeof getSql>>,
  job: {
    id: string;
    category: Category;
    budgetMinCents: number;
    budgetMaxCents: number;
    timeWindow: TimeWindow;
  },
) {
  const matching = await sql<{ id: string; distance_miles: number | string }>`
    select id, distance_miles from seed_pros
    where trades like ${"%" + job.category + "%"}
    order by rating_x10 desc
    limit 4
  `;
  let pros = matching;
  if (pros.length < 2) {
    pros = await sql<{ id: string; distance_miles: number | string }>`
      select id, distance_miles from seed_pros order by jobs_completed desc limit 3
    `;
  }
  const mid = (job.budgetMinCents + job.budgetMaxCents) / 2 || 20000;
  const notes = BID_NOTES[job.category] ?? BID_NOTES.other;
  const windows = [
    "Saturday 9:00–11:00 AM",
    "Saturday 10:00 AM–12:00 PM",
    "Saturday 8:00–10:00 AM",
    "This week, flexible",
  ];
  const windowPref =
    job.timeWindow === "morning"
      ? "Saturday 9:00–11:00 AM"
      : job.timeWindow === "afternoon"
        ? "Saturday 1:00–4:00 PM"
        : job.timeWindow === "evening"
          ? "Weekday 5:00–7:00 PM"
          : null;
  let i = 0;
  for (const pro of pros) {
    const variance = 0.82 + ((i * 17 + job.id.length) % 23) / 100;
    const amount = Math.round((mid * variance) / 100) * 100;
    const labor = Math.round(amount * (0.7 + (i % 3) * 0.05));
    const materials = Math.max(0, amount - labor);
    const eta = 1 + (i % 4);
    const warranty = [30, 14, 90, 30][i % 4];
    const duration = [45, 60, 90, 120][i % 4];
    await sql`
      insert into bids (
        id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status,
        labor_cents, materials_cents, warranty_days, duration_minutes, available_window,
        distance_miles
      )
      values (
        ${newId("bid")},
        ${job.id},
        ${pro.id},
        ${amount},
        ${notes[i % notes.length]},
        ${eta},
        ${i !== 1},
        'pending',
        ${labor},
        ${materials},
        ${warranty},
        ${duration},
        ${windowPref ?? windows[i % windows.length]},
        ${asNum(pro.distance_miles) || 3}
      )
    `;
    i += 1;
  }
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ProfileDb>`
      select user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
             rating_x10, jobs_completed, wallet_cents, created_at
      from profiles where user_id = ${context.userId} limit 1
    `;
    return rows[0] ? mapProfile(rows[0]) : null;
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      role: Role;
      displayName: string;
      city: string;
      zip: string;
      trades?: Category[];
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ user_id: string }>`
      select user_id from profiles where user_id = ${context.userId} limit 1
    `;
    if (existing[0]) return requireProfile(sql, context.userId);
    const name = data.displayName.trim().slice(0, 60) || "Neighbor";
    const city = data.city.trim().slice(0, 40) || "Dallas";
    const zip = data.zip.trim().slice(0, 10) || "75201";
    const role: Role = data.role === "pro" ? "pro" : "homeowner";
    const wallet = role === "homeowner" ? HOMEOWNER_STARTING_CENTS : 0;
    const trades = JSON.stringify(
      role === "pro" ? (data.trades ?? ["other"]).slice(0, 4) : [],
    );
    await sql`
      insert into profiles (
        user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
        rating_x10, jobs_completed, wallet_cents
      ) values (
        ${context.userId}, ${role}, ${name}, ${city}, ${zip}, ${""}, ${trades},
        ${role === "pro" ? 8500 : 0}, ${role === "pro" ? 48 : 0}, 0, ${wallet}
      )
    `;
    if (wallet > 0) {
      await sql`
        insert into wallet_events (id, user_id, amount_cents, kind, note)
        values (
          ${newId("we")},
          ${context.userId},
          ${wallet},
          'credit',
          'Starting demo balance for hiring pros'
        )
      `;
    }
    return requireProfile(sql, context.userId);
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      displayName: string;
      city: string;
      zip: string;
      bio: string;
      role?: Role;
      trades?: Category[];
      hourlyRateCents?: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const current = await requireProfile(sql, context.userId);
    const role = data.role ?? current.role;
    const trades = JSON.stringify(
      role === "pro" ? (data.trades ?? current.trades).slice(0, 4) : [],
    );
    await sql`
      update profiles set
        display_name = ${data.displayName.trim().slice(0, 60) || current.displayName},
        city = ${data.city.trim().slice(0, 40) || current.city},
        zip = ${data.zip.trim().slice(0, 10) || current.zip},
        bio = ${data.bio.trim().slice(0, 400)},
        role = ${role},
        trades = ${trades},
        hourly_rate_cents = ${Math.max(0, data.hourlyRateCents ?? current.hourlyRateCents)}
      where user_id = ${context.userId}
    `;
    return requireProfile(sql, context.userId);
  });

const DIAGNOSIS_PROMPT = `You are HandyPix AI, a practical residential repair diagnostician for Dallas-area homes.
Analyze the photo of a household problem. Return ONLY JSON with this exact shape:
{
  "issue": "short title, max 8 words",
  "category": "plumbing|electrical|hvac|painting|carpentry|appliance|roofing|flooring|other",
  "severity": "low|medium|high|emergency",
  "safety_level": "normal|caution|danger",
  "complexity": "small|standard|larger",
  "summary": "2-3 sentences a homeowner can act on. Preliminary visual assessment only.",
  "likely_cause": "one sentence",
  "observations": ["what is visible in the photo"],
  "follow_up_question": "one clarifying question",
  "follow_up_options": ["option", "option", "Not sure"],
  "diy_possible": true,
  "diy_difficulty": "easy|moderate|advanced|pro-only",
  "diy_steps": ["step"],
  "tools_needed": ["tool"],
  "parts": [{"name": "part", "est_cost_cents": 0}],
  "safety_notes": ["note"],
  "when_to_call_pro": "one sentence",
  "est_labor_hours": 1.5,
  "est_cost_min_cents": 0,
  "est_cost_max_cents": 0,
  "confidence": 80
}
Costs are US cents for typical Dallas / Fort Worth labor + parts in 2026. Be honest if the photo is unclear. Never invent a brand of fixture you cannot see.
Safety rules:
- normal: contained cosmetic or simple mechanical issues (loose handle, small drywall hole, faucet drip, hinge).
- caution: HVAC, significant plumbing leak, roof, electrical, structural concerns — recommend professional inspection.
- danger: exposed live wiring, gas, fire, major flooding, sagging/collapse. Set severity to emergency, diy_possible false, and put emergency instructions in safety_notes.
This is a preliminary visual assessment, never a certified inspection.`;

export const diagnosePhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { imageDataUrl: string; extraPhotos?: string[]; notes?: string }) => input)
  .handler(async ({ context, data }) => {
    const image = data.imageDataUrl.trim();
    if (!image.startsWith("data:image/")) {
      return { ok: false as const, error: "That does not look like a photo." };
    }
    if (image.length > 900_000) {
      return {
        ok: false as const,
        error: "Photo is too large. Try a closer crop.",
      };
    }
    const extras = (data.extraPhotos ?? [])
      .filter((p) => p.startsWith("data:image/") && p.length < 900_000)
      .slice(0, 3);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error: "AI diagnosis is unavailable in this environment.",
      };
    }
    const notes = (data.notes ?? "").trim().slice(0, 400);
    const userText = notes
      ? `Homeowner notes: ${notes}\nDiagnose this household issue. ${extras.length ? `The homeowner also attached ${extras.length} additional angle(s).` : ""}`
      : "Diagnose this household issue from the photo.";

    const content: unknown[] = [
      { type: "image_url", image_url: { url: image, detail: "high" } },
      ...extras.slice(0, 1).map((url) => ({
        type: "image_url",
        image_url: { url, detail: "low" },
      })),
      { type: "text", text: userText },
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 1600,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: DIAGNOSIS_PROMPT },
          { role: "user", content },
        ],
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      if (res.status >= 500) {
        return { ok: false as const, error: "Diagnosis service is busy. Try again." };
      }
      console.error("xAI diagnosis error", res.status, errText.slice(0, 300));
      return {
        ok: false as const,
        error: "Could not read that photo. Try another angle.",
      };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const rawContent = body.choices?.[0]?.message?.content ?? "";
    let parsed: Record<string, unknown>;
    try {
      const fence = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(fence ? fence[1] : rawContent) as Record<string, unknown>;
    } catch {
      return {
        ok: false as const,
        error: "The diagnosis came back unreadable. Try again.",
      };
    }
    const result = normalizeDiagnosis(parsed);
    const id = newId("dx");
    const sql = await getSql();
    const photoUrls = [image, ...extras];
    await sql`
      insert into diagnoses (id, user_id, photo_url, photo_urls, result)
      values (${id}, ${context.userId}, ${image}, ${JSON.stringify(photoUrls)}::jsonb, ${JSON.stringify(result)}::jsonb)
    `;
    const row: DiagnosisRow = {
      id,
      userId: context.userId,
      jobId: null,
      photoUrl: image,
      photoUrls,
      result,
      createdAt: new Date().toISOString(),
    };
    return { ok: true as const, diagnosis: row };
  });

export const listMyDiagnoses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      user_id: string;
      job_id: string | null;
      photo_url: string;
      photo_urls: unknown;
      result: unknown;
      created_at: string;
    }>`
      select id, user_id, job_id, photo_url, photo_urls, result, created_at
      from diagnoses where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
    return rows.map(mapDiagnosisRow);
  });

export const getDiagnosis = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      user_id: string;
      job_id: string | null;
      photo_url: string;
      photo_urls: unknown;
      result: unknown;
      created_at: string;
    }>`
      select id, user_id, job_id, photo_url, photo_urls, result, created_at
      from diagnoses where id = ${id} and user_id = ${context.userId} limit 1
    `;
    const r = rows[0];
    if (!r) return null;
    return mapDiagnosisRow(r);
  });

export const confirmDiagnosis = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { diagnosisId: string; answer: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ result: unknown }>`
      select result from diagnoses
      where id = ${data.diagnosisId} and user_id = ${context.userId} limit 1
    `;
    if (!rows[0]) throw new Error("Diagnosis not found");
    const result = normalizeDiagnosis(
      (asJson<Record<string, unknown>>(rows[0].result) ?? {}) as Record<string, unknown>,
    );
    result.follow_up_answer = data.answer.trim().slice(0, 80);
    await sql`
      update diagnoses set result = ${JSON.stringify(result)}::jsonb
      where id = ${data.diagnosisId} and user_id = ${context.userId}
    `;
    return result;
  });

export const postJobFromDiagnosis = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      diagnosisId: string;
      zip: string;
      urgency: Urgency;
      title?: string;
      description?: string;
      notes?: string;
      preferredDate?: string;
      timeWindow?: TimeWindow;
      budgetBand?: BudgetBand;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const profile = await requireProfile(sql, context.userId);
    const dx = await sql<{
      id: string;
      photo_url: string;
      result: unknown;
      job_id: string | null;
    }>`
      select id, photo_url, result, job_id from diagnoses
      where id = ${data.diagnosisId} and user_id = ${context.userId} limit 1
    `;
    if (!dx[0]) throw new Error("Diagnosis not found");
    if (dx[0].job_id) return { jobId: dx[0].job_id };
    const result = normalizeDiagnosis(
      (asJson<Record<string, unknown>>(dx[0].result) ?? {}) as Record<string, unknown>,
    );
    if (result.safety_level === "danger") {
      throw new Error("This issue is flagged as potentially dangerous and cannot be bid as a routine job.");
    }
    const jobId = newId("job");
    const title = (data.title ?? result.issue).trim().slice(0, 80) || result.issue;
    const generated = [
      result.summary,
      result.follow_up_answer
        ? `Homeowner notes: ${result.follow_up_question} ${result.follow_up_answer}.`
        : "",
      data.notes?.trim() ?? "",
    ]
      .filter(Boolean)
      .join("\n\n");
    const desc = (data.description?.trim() || generated).slice(0, 1600);
    const band: BudgetBand = isBudgetBand(String(data.budgetBand ?? "unknown"))
      ? (data.budgetBand as BudgetBand)
      : "unknown";
    const range = BUDGET_BAND_RANGE[band];
    const min = range.min || result.est_cost_min_cents;
    const max = range.max || result.est_cost_max_cents;
    const window: TimeWindow = isTimeWindow(String(data.timeWindow ?? "flexible"))
      ? (data.timeWindow as TimeWindow)
      : "flexible";
    const preferred = data.preferredDate?.slice(0, 10) || null;
    await sql`
      insert into jobs (
        id, homeowner_id, poster_name, title, description, category, photo_url,
        diagnosis, status, urgency, zip, budget_min_cents, budget_max_cents,
        is_seed, auto_award, preferred_date, time_window, budget_band
      ) values (
        ${jobId},
        ${context.userId},
        ${profile.displayName},
        ${title},
        ${desc},
        ${result.category},
        ${dx[0].photo_url},
        ${JSON.stringify(result)}::jsonb,
        'open',
        ${data.urgency},
        ${data.zip.trim().slice(0, 10) || profile.zip},
        ${min},
        ${max},
        false,
        false,
        ${preferred},
        ${window},
        ${band}
      )
    `;
    await sql`
      update diagnoses set job_id = ${jobId}
      where id = ${data.diagnosisId} and user_id = ${context.userId}
    `;
    await generateSeedBids(sql, {
      id: jobId,
      category: result.category,
      budgetMinCents: min,
      budgetMaxCents: max,
      timeWindow: window,
    });
    return { jobId };
  });

export const listMyJobs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<JobDb>`
      select j.*, (
        select count(*)::int from bids b where b.job_id = j.id
      ) as bid_count
      from jobs j
      where j.homeowner_id = ${context.userId}
      order by j.created_at desc
    `;
    return rows.map(mapJob);
  });

export const listMarketJobs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { category?: Category | "all" } | undefined) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const category = data?.category && data.category !== "all" ? data.category : null;
    const rows = category
      ? await sql<JobDb>`
          select j.*, (
            select count(*)::int from bids b where b.job_id = j.id
          ) as bid_count
          from jobs j
          where j.status = 'open' and j.category = ${category}
          order by case j.urgency when 'emergency' then 0 when 'soon' then 1 else 2 end,
                   j.created_at desc
        `
      : await sql<JobDb>`
          select j.*, (
            select count(*)::int from bids b where b.job_id = j.id
          ) as bid_count
          from jobs j
          where j.status = 'open'
          order by case j.urgency when 'emergency' then 0 when 'soon' then 1 else 2 end,
                   j.created_at desc
        `;
    return rows.map(mapJob);
  });

async function loadChangeOrders(
  sql: Awaited<ReturnType<typeof getSql>>,
  jobId: string,
): Promise<ChangeOrderRow[]> {
  const rows = await sql<{
    id: string;
    job_id: string;
    pro_id: string;
    reason: string;
    labor_cents: number;
    materials_cents: number;
    status: string;
    created_at: string;
  }>`
    select id, job_id, pro_id, reason, labor_cents, materials_cents, status, created_at
    from change_orders where job_id = ${jobId} order by created_at desc
  `;
  return rows.map((r) => ({
    id: r.id,
    jobId: r.job_id,
    proId: r.pro_id,
    reason: r.reason,
    laborCents: asNum(r.labor_cents),
    materialsCents: asNum(r.materials_cents),
    status: r.status as ChangeOrderRow["status"],
    createdAt: r.created_at,
  }));
}

export const getJobDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql<JobDb>`
      select j.*, (
        select count(*)::int from bids b where b.job_id = j.id
      ) as bid_count
      from jobs j where j.id = ${id} limit 1
    `;
    const jobRow = rows[0];
    if (!jobRow) return null;
    const job = mapJob(jobRow);
    const isOwner = job.homeownerId === context.userId;
    const bidRows = await sql<BidDb>`
      select id, job_id, pro_id, amount_cents, message, eta_days,
             materials_included, status, created_at,
             labor_cents, materials_cents, warranty_days, duration_minutes,
             available_window, distance_miles
      from bids where job_id = ${id}
      order by amount_cents asc, created_at asc
    `;
    const bids = await mapBids(sql, bidRows);
    const isAssigned = bids.some(
      (b) => b.proId === context.userId && b.status === "accepted",
    );
    if (!isOwner && !isAssigned && job.status !== "open" && !job.isSeed) {
      return null;
    }
    const payRows = await sql<{
      id: string;
      job_id: string;
      payer_id: string;
      payee_id: string;
      amount_cents: number;
      fee_cents: number;
      status: string;
      created_at: string;
      released_at: string | null;
    }>`
      select id, job_id, payer_id, payee_id, amount_cents, fee_cents, status, created_at, released_at
      from payments where job_id = ${id} order by created_at desc limit 1
    `;
    const payment: PaymentRow | null = payRows[0]
      ? {
          id: payRows[0].id,
          jobId: payRows[0].job_id,
          payerId: payRows[0].payer_id,
          payeeId: payRows[0].payee_id,
          amountCents: asNum(payRows[0].amount_cents),
          feeCents: asNum(payRows[0].fee_cents),
          status: payRows[0].status as PaymentRow["status"],
          createdAt: payRows[0].created_at,
          releasedAt: payRows[0].released_at,
        }
      : null;
    const review = await sql<{ rating: number; comment: string; tags: string }>`
      select rating, comment, tags from reviews where job_id = ${id} limit 1
    `;
    const disputeRows = await sql<{
      id: string;
      job_id: string;
      opened_by: string;
      reason: string;
      details: string;
      status: string;
      created_at: string;
    }>`
      select id, job_id, opened_by, reason, details, status, created_at
      from disputes where job_id = ${id} order by created_at desc limit 1
    `;
    const dispute: DisputeRow | null = disputeRows[0]
      ? {
          id: disputeRows[0].id,
          jobId: disputeRows[0].job_id,
          openedBy: disputeRows[0].opened_by,
          reason: disputeRows[0].reason,
          details: disputeRows[0].details,
          status: disputeRows[0].status as DisputeRow["status"],
          createdAt: disputeRows[0].created_at,
        }
      : null;
    return {
      job,
      bids,
      payment,
      isOwner,
      myBid: bids.find((b) => b.proId === context.userId) ?? null,
      review: review[0]
        ? {
            rating: asNum(review[0].rating),
            comment: review[0].comment,
            tags: asJson<string[]>(review[0].tags) ?? [],
          }
        : null,
      changeOrders: await loadChangeOrders(sql, id),
      dispute,
    };
  });

async function escrowPayment(
  sql: Awaited<ReturnType<typeof getSql>>,
  opts: {
    jobId: string;
    payerId: string;
    payeeId: string;
    amountCents: number;
    realPayer: boolean;
    note?: string;
  },
) {
  const fee = Math.round((opts.amountCents * PLATFORM_FEE_BPS) / 10_000);
  if (opts.realPayer) {
    const wallet = await sql<{ wallet_cents: number }>`
      select wallet_cents from profiles where user_id = ${opts.payerId} limit 1
    `;
    const bal = asNum(wallet[0]?.wallet_cents);
    if (bal < opts.amountCents) {
      throw new Error("INSUFFICIENT_FUNDS");
    }
    await sql`
      update profiles set wallet_cents = wallet_cents - ${opts.amountCents}
      where user_id = ${opts.payerId}
    `;
    await sql`
      insert into wallet_events (id, user_id, amount_cents, kind, job_id, note)
      values (
        ${newId("we")}, ${opts.payerId}, ${-opts.amountCents}, 'escrow', ${opts.jobId},
        ${opts.note ?? "Held until the job is confirmed"}
      )
    `;
  }
  const payId = newId("pay");
  await sql`
    insert into payments (id, job_id, payer_id, payee_id, amount_cents, fee_cents, status)
    values (${payId}, ${opts.jobId}, ${opts.payerId}, ${opts.payeeId}, ${opts.amountCents}, ${fee}, 'escrowed')
  `;
  return payId;
}

async function releasePayment(
  sql: Awaited<ReturnType<typeof getSql>>,
  jobId: string,
  payeeIsReal: boolean,
) {
  const pay = await sql<{
    id: string;
    payee_id: string;
    amount_cents: number;
    fee_cents: number;
    status: string;
  }>`
    select id, payee_id, amount_cents, fee_cents, status from payments
    where job_id = ${jobId} and status = 'escrowed'
  `;
  let netTotal = 0;
  let payee = "";
  for (const row of pay) {
    const net = asNum(row.amount_cents) - asNum(row.fee_cents);
    netTotal += net;
    payee = row.payee_id;
    await sql`
      update payments set status = 'released', released_at = now()
      where id = ${row.id}
    `;
  }
  if (!payee || netTotal <= 0) return;
  if (payeeIsReal) {
    await sql`
      update profiles set
        wallet_cents = wallet_cents + ${netTotal},
        jobs_completed = jobs_completed + 1
      where user_id = ${payee}
    `;
    await sql`
      insert into wallet_events (id, user_id, amount_cents, kind, job_id, note)
      values (
        ${newId("we")}, ${payee}, ${netTotal}, 'release', ${jobId},
        'Payout after the homeowner confirmed the work'
      )
    `;
  }
}

async function refundEscrow(
  sql: Awaited<ReturnType<typeof getSql>>,
  jobId: string,
  realPayer: boolean,
) {
  const pay = await sql<{
    id: string;
    payer_id: string;
    amount_cents: number;
    status: string;
  }>`
    select id, payer_id, amount_cents, status from payments
    where job_id = ${jobId} and status = 'escrowed'
  `;
  for (const row of pay) {
    await sql`update payments set status = 'refunded' where id = ${row.id}`;
    if (realPayer && !row.payer_id.startsWith("seed:")) {
      await sql`
        update profiles set wallet_cents = wallet_cents + ${asNum(row.amount_cents)}
        where user_id = ${row.payer_id}
      `;
      await sql`
        insert into wallet_events (id, user_id, amount_cents, kind, job_id, note)
        values (
          ${newId("we")}, ${row.payer_id}, ${asNum(row.amount_cents)}, 'refund', ${jobId},
          'Refunded after cancel'
        )
      `;
    }
  }
}

export const hireBid = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { bidId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const bid = await sql<BidDb>`
      select id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status, created_at,
             labor_cents, materials_cents, warranty_days, duration_minutes, available_window, distance_miles
      from bids where id = ${data.bidId} limit 1
    `;
    if (!bid[0] || bid[0].status !== "pending") throw new Error("Bid is no longer available");
    const jobRows = await sql<JobDb>`select * from jobs where id = ${bid[0].job_id} limit 1`;
    const job = jobRows[0];
    if (!job) throw new Error("Job not found");
    if (job.homeowner_id !== context.userId) throw new Error("Unauthorized");
    if (job.status !== "open") throw new Error("This job is no longer open");
    try {
      await escrowPayment(sql, {
        jobId: job.id,
        payerId: context.userId,
        payeeId: bid[0].pro_id,
        amountCents: asNum(bid[0].amount_cents),
        realPayer: true,
      });
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_FUNDS") {
        return { ok: false as const, error: "INSUFFICIENT_FUNDS" as const };
      }
      throw e;
    }
    await sql`update bids set status = 'accepted' where id = ${bid[0].id}`;
    await sql`
      update bids set status = 'declined'
      where job_id = ${job.id} and id <> ${bid[0].id} and status = 'pending'
    `;
    await sql`
      update jobs set status = 'in_progress', awarded_bid_id = ${bid[0].id}, awarded_at = now()
      where id = ${job.id} and homeowner_id = ${context.userId}
    `;
    const pro = await loadPro(sql, bid[0].pro_id);
    await sql`
      insert into messages (id, job_id, from_id, body)
      values (
        ${newId("msg")},
        ${job.id},
        ${bid[0].pro_id},
        ${`Booked. ${pro.displayName} will see you ${bid[0].available_window || "in the selected window"}. Message here — phone numbers stay hidden.`}
      )
    `;
    return { ok: true as const, jobId: job.id };
  });

export const createBid = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      jobId: string;
      amountCents?: number;
      laborCents?: number;
      materialsCents?: number;
      etaDays: number;
      message: string;
      materialsIncluded: boolean;
      warrantyDays?: number;
      durationMinutes?: number;
      availableWindow?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const profile = await requireProfile(sql, context.userId);
    if (profile.role !== "pro") throw new Error("Switch to a Pro profile to bid");
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job || job.status !== "open") throw new Error("This listing is closed");
    if (job.homeowner_id === context.userId) throw new Error("You cannot bid on your own job");
    const labor = Math.max(0, Math.round(asNum(data.laborCents)));
    const materials = Math.max(0, Math.round(asNum(data.materialsCents)));
    const amount = Math.round(asNum(data.amountCents) || labor + materials);
    if (amount < 2000 || amount > 5_000_000) throw new Error("Enter a realistic bid");
    const eta = Math.min(30, Math.max(1, Math.round(data.etaDays)));
    const warranty = Math.min(365, Math.max(0, Math.round(data.warrantyDays ?? 30)));
    const duration = Math.min(480, Math.max(15, Math.round(data.durationMinutes ?? 60)));
    const window = (data.availableWindow ?? "").trim().slice(0, 80);
    const existing = await sql<{ id: string }>`
      select id from bids where job_id = ${data.jobId} and pro_id = ${context.userId} limit 1
    `;
    if (existing[0]) {
      await sql`
        update bids set
          amount_cents = ${amount},
          eta_days = ${eta},
          message = ${data.message.trim().slice(0, 500)},
          materials_included = ${Boolean(data.materialsIncluded)},
          labor_cents = ${labor || Math.round(amount * 0.78)},
          materials_cents = ${materials || amount - Math.round(amount * 0.78)},
          warranty_days = ${warranty},
          duration_minutes = ${duration},
          available_window = ${window},
          status = 'pending'
        where id = ${existing[0].id} and pro_id = ${context.userId}
      `;
    } else {
      await sql`
        insert into bids (
          id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status,
          labor_cents, materials_cents, warranty_days, duration_minutes, available_window,
          distance_miles
        )
        values (
          ${newId("bid")}, ${data.jobId}, ${context.userId}, ${amount},
          ${data.message.trim().slice(0, 500)}, ${eta}, ${Boolean(data.materialsIncluded)}, 'pending',
          ${labor || Math.round(amount * 0.78)},
          ${materials || amount - Math.round(amount * 0.78)},
          ${warranty}, ${duration}, ${window}, 2.2
        )
      `;
    }
    const mappedJob = mapJob(job);
    if (mappedJob.isSeed && mappedJob.autoAward) {
      const mine = await sql<BidDb>`
        select id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status, created_at
        from bids where job_id = ${data.jobId} and pro_id = ${context.userId} limit 1
      `;
      if (mine[0]) {
        await escrowPayment(sql, {
          jobId: job.id,
          payerId: job.homeowner_id,
          payeeId: context.userId,
          amountCents: asNum(mine[0].amount_cents),
          realPayer: false,
        });
        await sql`update bids set status = 'accepted' where id = ${mine[0].id}`;
        await sql`
          update bids set status = 'declined'
          where job_id = ${job.id} and id <> ${mine[0].id} and status = 'pending'
        `;
        await sql`
          update jobs set status = 'in_progress', awarded_bid_id = ${mine[0].id}, awarded_at = now()
          where id = ${job.id}
        `;
        return { ok: true as const, autoAwarded: true as const, jobId: job.id };
      }
    }
    return { ok: true as const, autoAwarded: false as const, jobId: job.id };
  });

export const listMyBids = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<
      BidDb & {
        title: string;
        zip: string;
        photo_url: string;
        job_status: string;
        category: string;
      }
    >`
      select b.id, b.job_id, b.pro_id, b.amount_cents, b.message, b.eta_days,
             b.materials_included, b.status, b.created_at,
             j.title, j.zip, j.photo_url, j.status as job_status, j.category
      from bids b
      join jobs j on j.id = b.job_id
      where b.pro_id = ${context.userId}
      order by b.created_at desc
    `;
    return rows.map((r) => ({
      id: r.id,
      jobId: r.job_id,
      amountCents: asNum(r.amount_cents),
      etaDays: asNum(r.eta_days),
      status: r.status as BidRow["status"],
      createdAt: r.created_at,
      title: r.title,
      zip: r.zip,
      photoUrl: r.photo_url,
      jobStatus: r.job_status as JobStatus,
      category: r.category,
    }));
  });

export const markOnTheWay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job || job.status !== "in_progress") throw new Error("Job is not booked");
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    if (accepted[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
    await sql`update jobs set on_the_way_at = now() where id = ${job.id}`;
    const profile = await requireProfile(sql, context.userId);
    await sql`
      insert into messages (id, job_id, from_id, body)
      values (
        ${newId("msg")}, ${job.id}, ${context.userId},
        ${`${profile.displayName} is on the way.`}
      )
    `;
    return { ok: true as const };
  });

export const startJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job || job.status !== "in_progress") throw new Error("Job is not booked");
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    if (accepted[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
    await sql`
      update jobs set started_at = now(),
        on_the_way_at = coalesce(on_the_way_at, now())
      where id = ${job.id}
    `;
    return { ok: true as const, startedAt: new Date().toISOString() };
  });

export const markJobComplete = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { jobId: string; workPerformed?: string; afterPhotoUrl?: string }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job || job.status !== "in_progress") throw new Error("Job is not in progress");
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    if (accepted[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
    const work = (data.workPerformed ?? "").trim().slice(0, 600);
    const after = (data.afterPhotoUrl ?? "").startsWith("data:image/")
      ? data.afterPhotoUrl!.slice(0, 900_000)
      : "";
    const mapped = mapJob(job);
    await sql`
      update jobs set
        work_performed = ${work},
        after_photo_url = ${after},
        started_at = coalesce(started_at, now())
      where id = ${job.id}
    `;
    if (mapped.isSeed) {
      await sql`update jobs set status = 'complete' where id = ${job.id}`;
      await releasePayment(sql, job.id, true);
      return { ok: true as const, autoConfirmed: true as const };
    }
    await sql`update jobs set status = 'awaiting_confirm' where id = ${job.id}`;
    return { ok: true as const, autoConfirmed: false as const };
  });

export const confirmJobComplete = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { jobId: string; rating: number; comment: string; tags?: string[] }) =>
      input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job) throw new Error("Job not found");
    if (job.homeowner_id !== context.userId) throw new Error("Unauthorized");
    if (job.status !== "awaiting_confirm" && job.status !== "in_progress") {
      throw new Error("Nothing to confirm");
    }
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    const payee = accepted[0]?.pro_id;
    await sql`update jobs set status = 'complete' where id = ${job.id} and homeowner_id = ${context.userId}`;
    await releasePayment(sql, job.id, Boolean(payee && !payee.startsWith("seed:")));
    const rating = Math.min(5, Math.max(1, Math.round(data.rating)));
    const tags = JSON.stringify((data.tags ?? []).slice(0, 6));
    if (payee) {
      await sql`
        insert into reviews (id, job_id, from_id, to_id, rating, comment, tags)
        values (
          ${newId("rv")}, ${job.id}, ${context.userId}, ${payee}, ${rating},
          ${data.comment.trim().slice(0, 400)}, ${tags}
        )
      `;
      if (!payee.startsWith("seed:")) {
        await sql`
          update profiles set rating_x10 = case
            when jobs_completed <= 1 then ${rating * 10}
            else round((rating_x10 * (jobs_completed - 1) + ${rating * 10})::numeric / jobs_completed)
          end
          where user_id = ${payee}
        `;
      }
    }
    return { ok: true as const };
  });

export const cancelJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job) throw new Error("Job not found");
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    const isOwner = job.homeowner_id === context.userId;
    const isPro = accepted[0]?.pro_id === context.userId;
    if (!isOwner && !isPro) throw new Error("Unauthorized");
    if (job.status === "complete" || job.status === "cancelled") {
      throw new Error("This job is already closed");
    }
    if (job.started_at) throw new Error("Work has started — open a dispute instead");
    await refundEscrow(sql, job.id, isOwner);
    await sql`update jobs set status = 'cancelled' where id = ${job.id}`;
    return { ok: true as const };
  });

export const requestChangeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      jobId: string;
      reason: string;
      laborCents: number;
      materialsCents: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job || (job.status !== "in_progress" && job.status !== "awaiting_confirm")) {
      throw new Error("No active job");
    }
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    if (accepted[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
    const labor = Math.max(0, Math.round(data.laborCents));
    const materials = Math.max(0, Math.round(data.materialsCents));
    if (labor + materials < 1000) throw new Error("Enter a real additional amount");
    const id = newId("co");
    await sql`
      insert into change_orders (id, job_id, pro_id, reason, labor_cents, materials_cents, status)
      values (
        ${id}, ${job.id}, ${context.userId},
        ${data.reason.trim().slice(0, 400)}, ${labor}, ${materials}, 'pending'
      )
    `;
    return { ok: true as const, id };
  });

export const respondChangeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { changeOrderId: string; approve: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      job_id: string;
      pro_id: string;
      labor_cents: number;
      materials_cents: number;
      status: string;
    }>`
      select id, job_id, pro_id, labor_cents, materials_cents, status
      from change_orders where id = ${data.changeOrderId} limit 1
    `;
    const co = rows[0];
    if (!co || co.status !== "pending") throw new Error("Change order not found");
    const jobRows = await sql<JobDb>`select * from jobs where id = ${co.job_id} limit 1`;
    const job = jobRows[0];
    if (!job || job.homeowner_id !== context.userId) throw new Error("Unauthorized");
    if (!data.approve) {
      await sql`update change_orders set status = 'declined' where id = ${co.id}`;
      return { ok: true as const, approved: false as const };
    }
    const extra = asNum(co.labor_cents) + asNum(co.materials_cents);
    try {
      await escrowPayment(sql, {
        jobId: job.id,
        payerId: context.userId,
        payeeId: co.pro_id,
        amountCents: extra,
        realPayer: true,
        note: "Additional work held until confirmation",
      });
    } catch (e) {
      if (e instanceof Error && e.message === "INSUFFICIENT_FUNDS") {
        return { ok: false as const, error: "INSUFFICIENT_FUNDS" as const };
      }
      throw e;
    }
    await sql`update change_orders set status = 'approved' where id = ${co.id}`;
    return { ok: true as const, approved: true as const };
  });

export const openDispute = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: string; reason: string; details: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job || job.homeowner_id !== context.userId) throw new Error("Unauthorized");
    if (job.status === "complete" || job.status === "cancelled") {
      throw new Error("This job is closed");
    }
    const existing = await sql<{ id: string }>`
      select id from disputes where job_id = ${job.id} and status = 'open' limit 1
    `;
    if (existing[0]) return { ok: true as const, id: existing[0].id };
    const id = newId("dsp");
    await sql`
      insert into disputes (id, job_id, opened_by, reason, details, status)
      values (
        ${id}, ${job.id}, ${context.userId},
        ${data.reason.slice(0, 40)}, ${data.details.trim().slice(0, 800)}, 'open'
      )
    `;
    return { ok: true as const, id };
  });

export const listThreads = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const jobs = await sql<{
      id: string;
      title: string;
      photo_url: string;
      status: string;
      homeowner_id: string;
      awarded_bid_id: string | null;
      poster_name: string;
    }>`
      select j.id, j.title, j.photo_url, j.status, j.homeowner_id, j.awarded_bid_id, j.poster_name
      from jobs j
      left join bids b on b.id = j.awarded_bid_id
      where j.homeowner_id = ${context.userId} or b.pro_id = ${context.userId}
      order by j.created_at desc
      limit 40
    `;
    const threads: MessageThread[] = [];
    for (const job of jobs) {
      if (job.status === "open" || job.status === "cancelled") continue;
      const last = await sql<{ body: string; created_at: string; from_id: string }>`
        select body, created_at, from_id from messages
        where job_id = ${job.id} order by created_at desc limit 1
      `;
      let otherName = job.poster_name;
      if (job.homeowner_id === context.userId && job.awarded_bid_id) {
        const pro = await sql<{ pro_id: string }>`
          select pro_id from bids where id = ${job.awarded_bid_id} limit 1
        `;
        if (pro[0]) {
          const p = await loadPro(sql, pro[0].pro_id);
          otherName = p.displayName;
        }
      }
      threads.push({
        jobId: job.id,
        title: job.title,
        photoUrl: job.photo_url,
        status: job.status as JobStatus,
        lastBody: last[0]?.body ?? "Job booked — say hello",
        lastAt: last[0]?.created_at ?? new Date().toISOString(),
        otherName,
      });
    }
    return threads;
  });

export const listMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((jobId: string) => jobId)
  .handler(async ({ context, data: jobId }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${jobId} limit 1`;
    const job = jobRows[0];
    if (!job) return [];
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    const allowed =
      job.homeowner_id === context.userId || accepted[0]?.pro_id === context.userId;
    if (!allowed) return [];
    const rows = await sql<{
      id: string;
      job_id: string;
      from_id: string;
      body: string;
      created_at: string;
    }>`
      select id, job_id, from_id, body, created_at
      from messages where job_id = ${jobId} order by created_at asc
    `;
    const out: MessageRow[] = [];
    for (const r of rows) {
      let fromName = "HandyPix";
      if (r.from_id === context.userId) fromName = "You";
      else if (r.from_id === job.homeowner_id) fromName = job.poster_name;
      else fromName = (await loadPro(sql, r.from_id)).displayName;
      out.push({
        id: r.id,
        jobId: r.job_id,
        fromId: r.from_id,
        fromName,
        body: r.body,
        createdAt: r.created_at,
        mine: r.from_id === context.userId,
      });
    }
    return out;
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { jobId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const jobRows = await sql<JobDb>`select * from jobs where id = ${data.jobId} limit 1`;
    const job = jobRows[0];
    if (!job) throw new Error("Job not found");
    const accepted = await sql<{ pro_id: string }>`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
    const allowed =
      job.homeowner_id === context.userId || accepted[0]?.pro_id === context.userId;
    if (!allowed) throw new Error("Unauthorized");
    const body = data.body.trim().slice(0, 500);
    if (!body) throw new Error("Write a message");
    const id = newId("msg");
    await sql`
      insert into messages (id, job_id, from_id, body)
      values (${id}, ${job.id}, ${context.userId}, ${body})
    `;
    return { ok: true as const, id };
  });

export const getProProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const pro = await loadPro(sql, id);
    const jobs = await sql<{ photo_url: string; title: string }>`
      select j.photo_url, j.title from bids b
      join jobs j on j.id = b.job_id
      where b.pro_id = ${id} and b.status = 'accepted' and j.photo_url <> ''
      order by j.created_at desc
      limit 4
    `;
    const fallback = [
      { src: "/jobs/leaky-faucet.jpg", caption: "Fixture repair" },
      { src: "/jobs/cracked-drywall.jpg", caption: "Interior repair" },
    ];
    const portfolio =
      jobs.length > 0
        ? jobs.map((j) => ({ src: j.photo_url, caption: j.title }))
        : fallback;
    return { pro, portfolio };
  });

export const addFunds = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireProfile(sql, context.userId);
    await sql`
      update profiles set wallet_cents = wallet_cents + ${TOP_UP_CENTS}
      where user_id = ${context.userId}
    `;
    await sql`
      insert into wallet_events (id, user_id, amount_cents, kind, note)
      values (
        ${newId("we")}, ${context.userId}, ${TOP_UP_CENTS}, 'credit',
        'Demo top-up'
      )
    `;
    return requireProfile(sql, context.userId);
  });

export const getWallet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profile = await requireProfile(sql, context.userId);
    const events = await sql<{
      id: string;
      amount_cents: number;
      kind: string;
      job_id: string | null;
      note: string;
      created_at: string;
    }>`
      select id, amount_cents, kind, job_id, note, created_at
      from wallet_events where user_id = ${context.userId}
      order by created_at desc
      limit 30
    `;
    const mapped: WalletEvent[] = events.map((e) => ({
      id: e.id,
      amountCents: asNum(e.amount_cents),
      kind: e.kind,
      jobId: e.job_id,
      note: e.note,
      createdAt: e.created_at,
    }));
    return { profile, events: mapped };
  });

export const getBidCheckout = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((bidId: string) => bidId)
  .handler(async ({ context, data: bidId }) => {
    const sql = await getSql();
    const bidRows = await sql<BidDb>`
      select id, job_id, pro_id, amount_cents, message, eta_days,
             materials_included, status, created_at,
             labor_cents, materials_cents, warranty_days, duration_minutes,
             available_window, distance_miles
      from bids where id = ${bidId} limit 1
    `;
    const bid = bidRows[0];
    if (!bid) return null;
    const jobRows = await sql<JobDb>`select * from jobs where id = ${bid.job_id} limit 1`;
    const job = jobRows[0];
    if (!job || job.homeowner_id !== context.userId) return null;
    const mappedBids = await mapBids(sql, [bid]);
    return {
      job: mapJob(job),
      bid: mappedBids[0],
    };
  });
