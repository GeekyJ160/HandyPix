import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as CATEGORY_FOLLOW_UP, g as SEVERITIES, i as CATEGORIES, m as SAFETY_LEVELS, r as BUDGET_BAND_RANGE, s as COMPLEXITIES, t as BUDGET_BANDS, u as HOMEOWNER_STARTING_CENTS, x as TOP_UP_CENTS, y as TIME_WINDOWS } from "./handypix-types-ysH_gE1n.mjs";
import { r as getSql } from "./db-C3B78sTH.mjs";
import { t as authMiddleware } from "./middleware-Ct9xyLPo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handypix-api-BFQnstag.js
function newId(prefix) {
	return `${prefix}_${crypto.randomUUID()}`;
}
function asJson(value) {
	if (value == null) return value;
	if (typeof value === "string") return JSON.parse(value);
	return value;
}
function asBool(v) {
	return v === true || v === "t" || v === "true" || v === 1;
}
function asNum(v) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : 0;
}
function isTimeWindow(v) {
	return TIME_WINDOWS.includes(v);
}
function isBudgetBand(v) {
	return BUDGET_BANDS.includes(v);
}
function mapProfile(row) {
	const trades = asJson(row.trades) ?? [];
	return {
		userId: row.user_id,
		role: row.role === "pro" ? "pro" : "homeowner",
		displayName: row.display_name,
		city: row.city,
		zip: row.zip,
		bio: row.bio,
		trades: trades.filter((t) => CATEGORIES.includes(t)),
		hourlyRateCents: asNum(row.hourly_rate_cents),
		ratingX10: asNum(row.rating_x10),
		jobsCompleted: asNum(row.jobs_completed),
		walletCents: asNum(row.wallet_cents),
		createdAt: row.created_at
	};
}
function mapJob(row) {
	return {
		id: row.id,
		homeownerId: row.homeowner_id,
		posterName: row.poster_name,
		title: row.title,
		description: row.description,
		category: CATEGORIES.includes(row.category) ? row.category : "other",
		photoUrl: row.photo_url,
		diagnosis: row.diagnosis ? normalizeDiagnosis(asJson(row.diagnosis) ?? {}) : null,
		status: row.status,
		urgency: row.urgency,
		zip: row.zip,
		budgetMinCents: asNum(row.budget_min_cents),
		budgetMaxCents: asNum(row.budget_max_cents),
		awardedBidId: row.awarded_bid_id,
		isSeed: asBool(row.is_seed),
		autoAward: asBool(row.auto_award),
		bidCount: asNum(row.bid_count),
		createdAt: row.created_at,
		preferredDate: row.preferred_date ?? null,
		timeWindow: isTimeWindow(String(row.time_window ?? "flexible")) ? row.time_window : "flexible",
		budgetBand: isBudgetBand(String(row.budget_band ?? "unknown")) ? row.budget_band : "unknown",
		awardedAt: row.awarded_at ?? null,
		onTheWayAt: row.on_the_way_at ?? null,
		startedAt: row.started_at ?? null,
		workPerformed: row.work_performed ?? "",
		afterPhotoUrl: row.after_photo_url ?? ""
	};
}
function mapProReviews(raw) {
	return (asJson(raw) ?? []).map((item) => {
		const o = item ?? {};
		const tags = Array.isArray(o.tags) ? o.tags.map((t) => String(t)) : [];
		return {
			author: String(o.author ?? "Neighbor"),
			rating: Math.min(5, Math.max(1, asNum(o.rating) || 5)),
			comment: String(o.comment ?? ""),
			tags
		};
	}).slice(0, 8);
}
function mapPro(row) {
	const trades = asJson(row.trades) ?? [];
	return {
		id: row.id,
		displayName: row.display_name,
		city: row.city,
		zip: row.zip,
		trades: trades.filter((t) => CATEGORIES.includes(t)),
		bio: row.bio,
		hourlyRateCents: asNum(row.hourly_rate_cents),
		ratingX10: asNum(row.rating_x10),
		jobsCompleted: asNum(row.jobs_completed),
		yearsExp: asNum(row.years_exp),
		identityVerified: row.identity_verified == null ? true : asBool(row.identity_verified),
		insurance: row.insurance == null ? true : asBool(row.insurance),
		backgroundCheck: row.background_check == null ? true : asBool(row.background_check),
		distanceMiles: Math.round(asNum(row.distance_miles || 3) * 10) / 10,
		reviews: mapProReviews(row.reviews)
	};
}
async function loadPro(sql, proId) {
	const seed = await sql`
    select id, display_name, city, zip, trades, bio, hourly_rate_cents,
           rating_x10, jobs_completed, years_exp, identity_verified, insurance,
           background_check, distance_miles, reviews
    from seed_pros where id = ${proId} limit 1
  `;
	if (seed[0]) return mapPro(seed[0]);
	const real = await sql`
    select user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
           rating_x10, jobs_completed, wallet_cents, created_at
    from profiles where user_id = ${proId} limit 1
  `;
	if (real[0]) {
		const p = mapProfile(real[0]);
		const reviewRows = await sql`
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
				tags: asJson(r.tags) ?? []
			}))
		};
	}
	return {
		id: proId,
		displayName: "Handyman",
		city: "Dallas",
		zip: "75201",
		trades: ["other"],
		bio: "",
		hourlyRateCents: 8e3,
		ratingX10: 45,
		jobsCompleted: 0,
		yearsExp: 1,
		identityVerified: false,
		insurance: false,
		backgroundCheck: false,
		distanceMiles: 4,
		reviews: []
	};
}
async function mapBids(sql, rows) {
	const out = [];
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
			status: row.status,
			createdAt: row.created_at,
			laborCents: labor || Math.round(amount * .78),
			materialsCents: materials || amount - Math.round(amount * .78),
			warrantyDays: asNum(row.warranty_days) || 30,
			durationMinutes: asNum(row.duration_minutes) || 60,
			availableWindow: row.available_window || `In ${asNum(row.eta_days) || 2} day(s)`,
			distanceMiles: Math.round(asNum(row.distance_miles || pro.distanceMiles) * 10) / 10,
			pro
		});
	}
	return out;
}
async function requireProfile(sql, userId) {
	const rows = await sql`
    select user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
           rating_x10, jobs_completed, wallet_cents, created_at
    from profiles where user_id = ${userId} limit 1
  `;
	if (!rows[0]) throw new Error("Finish setup to continue");
	return mapProfile(rows[0]);
}
function isCategory(v) {
	return CATEGORIES.includes(v);
}
function deriveSafety(severity, category) {
	if (severity === "emergency") return "danger";
	if (severity === "high" || category === "electrical" || category === "hvac" || category === "roofing") return "caution";
	return "normal";
}
function deriveComplexity(diy, hours) {
	if (diy === "pro-only" || hours >= 4) return "larger";
	if (diy === "easy" || hours <= 1.5) return "small";
	return "standard";
}
function listStr(v, max = 8) {
	return (Array.isArray(v) ? v : []).map((x) => String(x)).filter(Boolean).slice(0, max);
}
function normalizeDiagnosis(raw) {
	const category = isCategory(String(raw.category ?? "other")) ? raw.category : "other";
	const severity = SEVERITIES.includes(String(raw.severity)) ? raw.severity : "medium";
	const parts = (Array.isArray(raw.parts) ? raw.parts : []).map((p) => {
		const o = p;
		return {
			name: String(o.name ?? "Part"),
			est_cost_cents: Math.max(0, Math.round(asNum(o.est_cost_cents)))
		};
	}).slice(0, 8);
	const diy = [
		"easy",
		"moderate",
		"advanced",
		"pro-only"
	].includes(String(raw.diy_difficulty)) ? raw.diy_difficulty : "moderate";
	const hours = Math.max(.5, asNum(raw.est_labor_hours) || 2);
	const follow = CATEGORY_FOLLOW_UP[category];
	const safety = SAFETY_LEVELS.includes(String(raw.safety_level)) ? raw.safety_level : deriveSafety(severity, category);
	const complexity = COMPLEXITIES.includes(String(raw.complexity)) ? raw.complexity : deriveComplexity(diy, hours);
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
		observations: observations.length > 0 ? observations : [String(raw.likely_cause ?? "Visible wear in the photo")].filter(Boolean),
		follow_up_question: String(raw.follow_up_question ?? follow.question).slice(0, 120),
		follow_up_options: listStr(raw.follow_up_options, 4).length ? listStr(raw.follow_up_options, 4) : follow.options,
		follow_up_answer: String(raw.follow_up_answer ?? ""),
		safety_level: safety,
		complexity
	};
}
function mapDiagnosisRow(r) {
	const extras = asJson(r.photo_urls) ?? [];
	return {
		id: r.id,
		userId: r.user_id,
		jobId: r.job_id,
		photoUrl: r.photo_url,
		photoUrls: extras.length ? extras : [r.photo_url],
		result: normalizeDiagnosis(asJson(r.result) ?? {}),
		createdAt: r.created_at
	};
}
var BID_NOTES = {
	plumbing: [
		"I can inspect the connection and replace the gasket or trap if necessary. Materials included up to the bid.",
		"Same-day window if the part is on the truck. I text photos before anything extra.",
		"I warranty the work. If shutoffs are frozen I will quote that first."
	],
	electrical: [
		"Licensed work only. I will make the circuit safe, then replace what failed.",
		"I test the run before closing the box. Heat-damaged wire is a stop-and-quote.",
		"Code-first repair. I will not leave a device on cooked conductors."
	],
	hvac: [
		"Diagnosis first: airflow, amp draw, then a written fix. No surprise add-ons.",
		"I clean what is clogged and tell you if refrigerant is actually the issue.",
		"If the compressor is at risk I will shut it down and explain before quoting."
	],
	carpentry: [
		"I match the material, check the structure underneath, and leave it paint-ready.",
		"Clean cuts, coated fasteners, and a walkthrough of anything else that is going.",
		"I will not patch over rot. If the framing is soft I stop and show you."
	],
	painting: ["Repair, prime, and paint the whole plane so it does not flash in daylight.", "Dust control and a tight color match. Furniture gets covered."],
	appliance: ["I diagnose before ordering parts. If it is not worth fixing I will say so.", "Most residential brands. I test a full cycle before I call it done."],
	roofing: ["I find the water path from above, not just the stain. Photos on the way out.", "Flashing and boots first. Drywall waits until the roof is actually dry."],
	flooring: ["I pull enough to see the subfloor. Matching plank if I can source it today."],
	other: ["I will look at it in person, give you a firm number, and do the work that day if it is small.", "General repair. If it needs a license I will tell you and help you hire that trade."]
};
async function generateSeedBids(sql, job) {
	let pros = await sql`
    select id, distance_miles from seed_pros
    where trades like ${"%" + job.category + "%"}
    order by rating_x10 desc
    limit 4
  `;
	if (pros.length < 2) pros = await sql`
      select id, distance_miles from seed_pros order by jobs_completed desc limit 3
    `;
	const mid = (job.budgetMinCents + job.budgetMaxCents) / 2 || 2e4;
	const notes = BID_NOTES[job.category] ?? BID_NOTES.other;
	const windows = [
		"Saturday 9:00–11:00 AM",
		"Saturday 10:00 AM–12:00 PM",
		"Saturday 8:00–10:00 AM",
		"This week, flexible"
	];
	const windowPref = job.timeWindow === "morning" ? "Saturday 9:00–11:00 AM" : job.timeWindow === "afternoon" ? "Saturday 1:00–4:00 PM" : job.timeWindow === "evening" ? "Weekday 5:00–7:00 PM" : null;
	let i = 0;
	for (const pro of pros) {
		const variance = .82 + (i * 17 + job.id.length) % 23 / 100;
		const amount = Math.round(mid * variance / 100) * 100;
		const labor = Math.round(amount * (.7 + i % 3 * .05));
		const materials = Math.max(0, amount - labor);
		const eta = 1 + i % 4;
		const warranty = [
			30,
			14,
			90,
			30
		][i % 4];
		const duration = [
			45,
			60,
			90,
			120
		][i % 4];
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
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "21be64e2d77b8f8def8e5ab4c6222094bb65b6da7afc3966d642697263b5a7eb",
	name: "getMyProfile",
	filename: "src/lib/handypix-api.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const rows = await (await getSql())`
      select user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
             rating_x10, jobs_completed, wallet_cents, created_at
      from profiles where user_id = ${context.userId} limit 1
    `;
	return rows[0] ? mapProfile(rows[0]) : null;
});
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "f462a15177cb8874c3d8079e1fed934dbb55fbadb2b07a140ea26721bbd61b6e",
	name: "completeOnboarding",
	filename: "src/lib/handypix-api.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select user_id from profiles where user_id = ${context.userId} limit 1
    `)[0]) return requireProfile(sql, context.userId);
	const name = data.displayName.trim().slice(0, 60) || "Neighbor";
	const city = data.city.trim().slice(0, 40) || "Dallas";
	const zip = data.zip.trim().slice(0, 10) || "75201";
	const role = data.role === "pro" ? "pro" : "homeowner";
	const wallet = role === "homeowner" ? HOMEOWNER_STARTING_CENTS : 0;
	const trades = JSON.stringify(role === "pro" ? (data.trades ?? ["other"]).slice(0, 4) : []);
	await sql`
      insert into profiles (
        user_id, role, display_name, city, zip, bio, trades, hourly_rate_cents,
        rating_x10, jobs_completed, wallet_cents
      ) values (
        ${context.userId}, ${role}, ${name}, ${city}, ${zip}, ${""}, ${trades},
        ${role === "pro" ? 8500 : 0}, ${role === "pro" ? 48 : 0}, 0, ${wallet}
      )
    `;
	if (wallet > 0) await sql`
        insert into wallet_events (id, user_id, amount_cents, kind, note)
        values (
          ${newId("we")},
          ${context.userId},
          ${wallet},
          'credit',
          'Starting demo balance for hiring pros'
        )
      `;
	return requireProfile(sql, context.userId);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "0730242d1591d14014af713612dac0c9829121be18669c6897849cb154d85a48",
	name: "updateProfile",
	filename: "src/lib/handypix-api.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const current = await requireProfile(sql, context.userId);
	const role = data.role ?? current.role;
	const trades = JSON.stringify(role === "pro" ? (data.trades ?? current.trades).slice(0, 4) : []);
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
var DIAGNOSIS_PROMPT = `You are HandyPix AI, a practical residential repair diagnostician for Dallas-area homes.
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
var diagnosePhoto_createServerFn_handler = createServerRpc({
	id: "c0a2b066bad114c658c6487a675bea885abcb6e8df558fd0da52602e602c1cb7",
	name: "diagnosePhoto",
	filename: "src/lib/handypix-api.ts"
}, (opts) => diagnosePhoto.__executeServer(opts));
var diagnosePhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(diagnosePhoto_createServerFn_handler, async ({ context, data }) => {
	const image = data.imageDataUrl.trim();
	if (!image.startsWith("data:image/")) return {
		ok: false,
		error: "That does not look like a photo."
	};
	if (image.length > 9e5) return {
		ok: false,
		error: "Photo is too large. Try a closer crop."
	};
	const extras = (data.extraPhotos ?? []).filter((p) => p.startsWith("data:image/") && p.length < 9e5).slice(0, 3);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI diagnosis is unavailable in this environment."
	};
	const notes = (data.notes ?? "").trim().slice(0, 400);
	const userText = notes ? `Homeowner notes: ${notes}\nDiagnose this household issue. ${extras.length ? `The homeowner also attached ${extras.length} additional angle(s).` : ""}` : "Diagnose this household issue from the photo.";
	const content = [
		{
			type: "image_url",
			image_url: {
				url: image,
				detail: "high"
			}
		},
		...extras.slice(0, 1).map((url) => ({
			type: "image_url",
			image_url: {
				url,
				detail: "low"
			}
		})),
		{
			type: "text",
			text: userText
		}
	];
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 1600,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: DIAGNOSIS_PROMPT
			}, {
				role: "user",
				content
			}]
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		if (res.status >= 500) return {
			ok: false,
			error: "Diagnosis service is busy. Try again."
		};
		console.error("xAI diagnosis error", res.status, errText.slice(0, 300));
		return {
			ok: false,
			error: "Could not read that photo. Try another angle."
		};
	}
	const rawContent = (await res.json()).choices?.[0]?.message?.content ?? "";
	let parsed;
	try {
		const fence = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
		parsed = JSON.parse(fence ? fence[1] : rawContent);
	} catch {
		return {
			ok: false,
			error: "The diagnosis came back unreadable. Try again."
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
	return {
		ok: true,
		diagnosis: {
			id,
			userId: context.userId,
			jobId: null,
			photoUrl: image,
			photoUrls,
			result,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
});
var listMyDiagnoses_createServerFn_handler = createServerRpc({
	id: "bd1c3f65a10bc6c063b108f1fa94f3b2f1d5af20ffa9f07cbf04f6a745df7bb8",
	name: "listMyDiagnoses",
	filename: "src/lib/handypix-api.ts"
}, (opts) => listMyDiagnoses.__executeServer(opts));
var listMyDiagnoses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyDiagnoses_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, user_id, job_id, photo_url, photo_urls, result, created_at
      from diagnoses where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `).map(mapDiagnosisRow);
});
var getDiagnosis_createServerFn_handler = createServerRpc({
	id: "b7017df3ca3638b865585f6aed68e21f30691c68bd0113ab0679367dd817a0aa",
	name: "getDiagnosis",
	filename: "src/lib/handypix-api.ts"
}, (opts) => getDiagnosis.__executeServer(opts));
var getDiagnosis = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getDiagnosis_createServerFn_handler, async ({ context, data: id }) => {
	const r = (await (await getSql())`
      select id, user_id, job_id, photo_url, photo_urls, result, created_at
      from diagnoses where id = ${id} and user_id = ${context.userId} limit 1
    `)[0];
	if (!r) return null;
	return mapDiagnosisRow(r);
});
var confirmDiagnosis_createServerFn_handler = createServerRpc({
	id: "3234a8eee3c6f157fc043ca26cabfd03a3dd549f260c93d4c876f94e4c4d139b",
	name: "confirmDiagnosis",
	filename: "src/lib/handypix-api.ts"
}, (opts) => confirmDiagnosis.__executeServer(opts));
var confirmDiagnosis = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(confirmDiagnosis_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select result from diagnoses
      where id = ${data.diagnosisId} and user_id = ${context.userId} limit 1
    `;
	if (!rows[0]) throw new Error("Diagnosis not found");
	const result = normalizeDiagnosis(asJson(rows[0].result) ?? {});
	result.follow_up_answer = data.answer.trim().slice(0, 80);
	await sql`
      update diagnoses set result = ${JSON.stringify(result)}::jsonb
      where id = ${data.diagnosisId} and user_id = ${context.userId}
    `;
	return result;
});
var postJobFromDiagnosis_createServerFn_handler = createServerRpc({
	id: "bdca178b0d176afbb2deb71bc7d2b2483484686ea1e88a26c3c4129680abf25b",
	name: "postJobFromDiagnosis",
	filename: "src/lib/handypix-api.ts"
}, (opts) => postJobFromDiagnosis.__executeServer(opts));
var postJobFromDiagnosis = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postJobFromDiagnosis_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const profile = await requireProfile(sql, context.userId);
	const dx = await sql`
      select id, photo_url, result, job_id from diagnoses
      where id = ${data.diagnosisId} and user_id = ${context.userId} limit 1
    `;
	if (!dx[0]) throw new Error("Diagnosis not found");
	if (dx[0].job_id) return { jobId: dx[0].job_id };
	const result = normalizeDiagnosis(asJson(dx[0].result) ?? {});
	if (result.safety_level === "danger") throw new Error("This issue is flagged as potentially dangerous and cannot be bid as a routine job.");
	const jobId = newId("job");
	const title = (data.title ?? result.issue).trim().slice(0, 80) || result.issue;
	const generated = [
		result.summary,
		result.follow_up_answer ? `Homeowner notes: ${result.follow_up_question} ${result.follow_up_answer}.` : "",
		data.notes?.trim() ?? ""
	].filter(Boolean).join("\n\n");
	const desc = (data.description?.trim() || generated).slice(0, 1600);
	const band = isBudgetBand(String(data.budgetBand ?? "unknown")) ? data.budgetBand : "unknown";
	const range = BUDGET_BAND_RANGE[band];
	const min = range.min || result.est_cost_min_cents;
	const max = range.max || result.est_cost_max_cents;
	const window = isTimeWindow(String(data.timeWindow ?? "flexible")) ? data.timeWindow : "flexible";
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
		timeWindow: window
	});
	return { jobId };
});
var listMyJobs_createServerFn_handler = createServerRpc({
	id: "f95e836f1490585a7573264f9a23d303944862cb8140ac310256009d35187bdf",
	name: "listMyJobs",
	filename: "src/lib/handypix-api.ts"
}, (opts) => listMyJobs.__executeServer(opts));
var listMyJobs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyJobs_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select j.*, (
        select count(*)::int from bids b where b.job_id = j.id
      ) as bid_count
      from jobs j
      where j.homeowner_id = ${context.userId}
      order by j.created_at desc
    `).map(mapJob);
});
var listMarketJobs_createServerFn_handler = createServerRpc({
	id: "84eb69419c44c56664184e968f6250c1e33a2aa28f3e820810f963f24de86fff",
	name: "listMarketJobs",
	filename: "src/lib/handypix-api.ts"
}, (opts) => listMarketJobs.__executeServer(opts));
var listMarketJobs = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(listMarketJobs_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const category = data?.category && data.category !== "all" ? data.category : null;
	return (category ? await sql`
          select j.*, (
            select count(*)::int from bids b where b.job_id = j.id
          ) as bid_count
          from jobs j
          where j.status = 'open' and j.category = ${category}
          order by case j.urgency when 'emergency' then 0 when 'soon' then 1 else 2 end,
                   j.created_at desc
        ` : await sql`
          select j.*, (
            select count(*)::int from bids b where b.job_id = j.id
          ) as bid_count
          from jobs j
          where j.status = 'open'
          order by case j.urgency when 'emergency' then 0 when 'soon' then 1 else 2 end,
                   j.created_at desc
        `).map(mapJob);
});
async function loadChangeOrders(sql, jobId) {
	return (await sql`
    select id, job_id, pro_id, reason, labor_cents, materials_cents, status, created_at
    from change_orders where job_id = ${jobId} order by created_at desc
  `).map((r) => ({
		id: r.id,
		jobId: r.job_id,
		proId: r.pro_id,
		reason: r.reason,
		laborCents: asNum(r.labor_cents),
		materialsCents: asNum(r.materials_cents),
		status: r.status,
		createdAt: r.created_at
	}));
}
var getJobDetail_createServerFn_handler = createServerRpc({
	id: "095c5daa1c37c8174437e9ac34a7b5e762560ceaa2c015ea9ca534717b575935",
	name: "getJobDetail",
	filename: "src/lib/handypix-api.ts"
}, (opts) => getJobDetail.__executeServer(opts));
var getJobDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getJobDetail_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const jobRow = (await sql`
      select j.*, (
        select count(*)::int from bids b where b.job_id = j.id
      ) as bid_count
      from jobs j where j.id = ${id} limit 1
    `)[0];
	if (!jobRow) return null;
	const job = mapJob(jobRow);
	const isOwner = job.homeownerId === context.userId;
	const bids = await mapBids(sql, await sql`
      select id, job_id, pro_id, amount_cents, message, eta_days,
             materials_included, status, created_at,
             labor_cents, materials_cents, warranty_days, duration_minutes,
             available_window, distance_miles
      from bids where job_id = ${id}
      order by amount_cents asc, created_at asc
    `);
	const isAssigned = bids.some((b) => b.proId === context.userId && b.status === "accepted");
	if (!isOwner && !isAssigned && job.status !== "open" && !job.isSeed) return null;
	const payRows = await sql`
      select id, job_id, payer_id, payee_id, amount_cents, fee_cents, status, created_at, released_at
      from payments where job_id = ${id} order by created_at desc limit 1
    `;
	const payment = payRows[0] ? {
		id: payRows[0].id,
		jobId: payRows[0].job_id,
		payerId: payRows[0].payer_id,
		payeeId: payRows[0].payee_id,
		amountCents: asNum(payRows[0].amount_cents),
		feeCents: asNum(payRows[0].fee_cents),
		status: payRows[0].status,
		createdAt: payRows[0].created_at,
		releasedAt: payRows[0].released_at
	} : null;
	const review = await sql`
      select rating, comment, tags from reviews where job_id = ${id} limit 1
    `;
	const disputeRows = await sql`
      select id, job_id, opened_by, reason, details, status, created_at
      from disputes where job_id = ${id} order by created_at desc limit 1
    `;
	const dispute = disputeRows[0] ? {
		id: disputeRows[0].id,
		jobId: disputeRows[0].job_id,
		openedBy: disputeRows[0].opened_by,
		reason: disputeRows[0].reason,
		details: disputeRows[0].details,
		status: disputeRows[0].status,
		createdAt: disputeRows[0].created_at
	} : null;
	return {
		job,
		bids,
		payment,
		isOwner,
		myBid: bids.find((b) => b.proId === context.userId) ?? null,
		review: review[0] ? {
			rating: asNum(review[0].rating),
			comment: review[0].comment,
			tags: asJson(review[0].tags) ?? []
		} : null,
		changeOrders: await loadChangeOrders(sql, id),
		dispute
	};
});
async function escrowPayment(sql, opts) {
	const fee = Math.round(opts.amountCents * 800 / 1e4);
	if (opts.realPayer) {
		if (asNum((await sql`
      select wallet_cents from profiles where user_id = ${opts.payerId} limit 1
    `)[0]?.wallet_cents) < opts.amountCents) throw new Error("INSUFFICIENT_FUNDS");
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
async function releasePayment(sql, jobId, payeeIsReal) {
	const pay = await sql`
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
async function refundEscrow(sql, jobId, realPayer) {
	const pay = await sql`
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
var hireBid_createServerFn_handler = createServerRpc({
	id: "2bd6250c59f7ba8c6f27a43d73c624d5faff73c011d4f084055bc8d1999f22c4",
	name: "hireBid",
	filename: "src/lib/handypix-api.ts"
}, (opts) => hireBid.__executeServer(opts));
var hireBid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(hireBid_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const bid = await sql`
      select id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status, created_at,
             labor_cents, materials_cents, warranty_days, duration_minutes, available_window, distance_miles
      from bids where id = ${data.bidId} limit 1
    `;
	if (!bid[0] || bid[0].status !== "pending") throw new Error("Bid is no longer available");
	const job = (await sql`select * from jobs where id = ${bid[0].job_id} limit 1`)[0];
	if (!job) throw new Error("Job not found");
	if (job.homeowner_id !== context.userId) throw new Error("Unauthorized");
	if (job.status !== "open") throw new Error("This job is no longer open");
	try {
		await escrowPayment(sql, {
			jobId: job.id,
			payerId: context.userId,
			payeeId: bid[0].pro_id,
			amountCents: asNum(bid[0].amount_cents),
			realPayer: true
		});
	} catch (e) {
		if (e instanceof Error && e.message === "INSUFFICIENT_FUNDS") return {
			ok: false,
			error: "INSUFFICIENT_FUNDS"
		};
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
	return {
		ok: true,
		jobId: job.id
	};
});
var createBid_createServerFn_handler = createServerRpc({
	id: "a135b3779e7da39bdc93f71e55c38630a1900c8c3a7f8d20b1db6f87bab527f4",
	name: "createBid",
	filename: "src/lib/handypix-api.ts"
}, (opts) => createBid.__executeServer(opts));
var createBid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createBid_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await requireProfile(sql, context.userId)).role !== "pro") throw new Error("Switch to a Pro profile to bid");
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job || job.status !== "open") throw new Error("This listing is closed");
	if (job.homeowner_id === context.userId) throw new Error("You cannot bid on your own job");
	const labor = Math.max(0, Math.round(asNum(data.laborCents)));
	const materials = Math.max(0, Math.round(asNum(data.materialsCents)));
	const amount = Math.round(asNum(data.amountCents) || labor + materials);
	if (amount < 2e3 || amount > 5e6) throw new Error("Enter a realistic bid");
	const eta = Math.min(30, Math.max(1, Math.round(data.etaDays)));
	const warranty = Math.min(365, Math.max(0, Math.round(data.warrantyDays ?? 30)));
	const duration = Math.min(480, Math.max(15, Math.round(data.durationMinutes ?? 60)));
	const window = (data.availableWindow ?? "").trim().slice(0, 80);
	const existing = await sql`
      select id from bids where job_id = ${data.jobId} and pro_id = ${context.userId} limit 1
    `;
	if (existing[0]) await sql`
        update bids set
          amount_cents = ${amount},
          eta_days = ${eta},
          message = ${data.message.trim().slice(0, 500)},
          materials_included = ${Boolean(data.materialsIncluded)},
          labor_cents = ${labor || Math.round(amount * .78)},
          materials_cents = ${materials || amount - Math.round(amount * .78)},
          warranty_days = ${warranty},
          duration_minutes = ${duration},
          available_window = ${window},
          status = 'pending'
        where id = ${existing[0].id} and pro_id = ${context.userId}
      `;
	else await sql`
        insert into bids (
          id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status,
          labor_cents, materials_cents, warranty_days, duration_minutes, available_window,
          distance_miles
        )
        values (
          ${newId("bid")}, ${data.jobId}, ${context.userId}, ${amount},
          ${data.message.trim().slice(0, 500)}, ${eta}, ${Boolean(data.materialsIncluded)}, 'pending',
          ${labor || Math.round(amount * .78)},
          ${materials || amount - Math.round(amount * .78)},
          ${warranty}, ${duration}, ${window}, 2.2
        )
      `;
	const mappedJob = mapJob(job);
	if (mappedJob.isSeed && mappedJob.autoAward) {
		const mine = await sql`
        select id, job_id, pro_id, amount_cents, message, eta_days, materials_included, status, created_at
        from bids where job_id = ${data.jobId} and pro_id = ${context.userId} limit 1
      `;
		if (mine[0]) {
			await escrowPayment(sql, {
				jobId: job.id,
				payerId: job.homeowner_id,
				payeeId: context.userId,
				amountCents: asNum(mine[0].amount_cents),
				realPayer: false
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
			return {
				ok: true,
				autoAwarded: true,
				jobId: job.id
			};
		}
	}
	return {
		ok: true,
		autoAwarded: false,
		jobId: job.id
	};
});
var listMyBids_createServerFn_handler = createServerRpc({
	id: "143c75703b560ae93435687cf9bf36741a9ccff4cf5d5991f8629836c3f8dadd",
	name: "listMyBids",
	filename: "src/lib/handypix-api.ts"
}, (opts) => listMyBids.__executeServer(opts));
var listMyBids = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyBids_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select b.id, b.job_id, b.pro_id, b.amount_cents, b.message, b.eta_days,
             b.materials_included, b.status, b.created_at,
             j.title, j.zip, j.photo_url, j.status as job_status, j.category
      from bids b
      join jobs j on j.id = b.job_id
      where b.pro_id = ${context.userId}
      order by b.created_at desc
    `).map((r) => ({
		id: r.id,
		jobId: r.job_id,
		amountCents: asNum(r.amount_cents),
		etaDays: asNum(r.eta_days),
		status: r.status,
		createdAt: r.created_at,
		title: r.title,
		zip: r.zip,
		photoUrl: r.photo_url,
		jobStatus: r.job_status,
		category: r.category
	}));
});
var markOnTheWay_createServerFn_handler = createServerRpc({
	id: "fbd4cda6983df547e0650647dce8c5155d1d3b926417d12b5dc4a698f747710a",
	name: "markOnTheWay",
	filename: "src/lib/handypix-api.ts"
}, (opts) => markOnTheWay.__executeServer(opts));
var markOnTheWay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(markOnTheWay_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job || job.status !== "in_progress") throw new Error("Job is not booked");
	if ((await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `)[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
	await sql`update jobs set on_the_way_at = now() where id = ${job.id}`;
	const profile = await requireProfile(sql, context.userId);
	await sql`
      insert into messages (id, job_id, from_id, body)
      values (
        ${newId("msg")}, ${job.id}, ${context.userId},
        ${`${profile.displayName} is on the way.`}
      )
    `;
	return { ok: true };
});
var startJob_createServerFn_handler = createServerRpc({
	id: "d1a6a6999e189c4eb24c0951ca9967ceeb4529376aa8a9e00972a2513ec9731e",
	name: "startJob",
	filename: "src/lib/handypix-api.ts"
}, (opts) => startJob.__executeServer(opts));
var startJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(startJob_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job || job.status !== "in_progress") throw new Error("Job is not booked");
	if ((await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `)[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
	await sql`
      update jobs set started_at = now(),
        on_the_way_at = coalesce(on_the_way_at, now())
      where id = ${job.id}
    `;
	return {
		ok: true,
		startedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var markJobComplete_createServerFn_handler = createServerRpc({
	id: "746fb1d69c1344b1d5625806ed5a81d455d02983e2e9fb33ebed32c8cacf670d",
	name: "markJobComplete",
	filename: "src/lib/handypix-api.ts"
}, (opts) => markJobComplete.__executeServer(opts));
var markJobComplete = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(markJobComplete_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job || job.status !== "in_progress") throw new Error("Job is not in progress");
	if ((await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `)[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
	const work = (data.workPerformed ?? "").trim().slice(0, 600);
	const after = (data.afterPhotoUrl ?? "").startsWith("data:image/") ? data.afterPhotoUrl.slice(0, 9e5) : "";
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
		return {
			ok: true,
			autoConfirmed: true
		};
	}
	await sql`update jobs set status = 'awaiting_confirm' where id = ${job.id}`;
	return {
		ok: true,
		autoConfirmed: false
	};
});
var confirmJobComplete_createServerFn_handler = createServerRpc({
	id: "1be583674653d5aa228d1af49753bc81c3d48802a6fed12fa005e9d68738a23d",
	name: "confirmJobComplete",
	filename: "src/lib/handypix-api.ts"
}, (opts) => confirmJobComplete.__executeServer(opts));
var confirmJobComplete = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(confirmJobComplete_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job) throw new Error("Job not found");
	if (job.homeowner_id !== context.userId) throw new Error("Unauthorized");
	if (job.status !== "awaiting_confirm" && job.status !== "in_progress") throw new Error("Nothing to confirm");
	const payee = (await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `)[0]?.pro_id;
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
		if (!payee.startsWith("seed:")) await sql`
          update profiles set rating_x10 = case
            when jobs_completed <= 1 then ${rating * 10}
            else round((rating_x10 * (jobs_completed - 1) + ${rating * 10})::numeric / jobs_completed)
          end
          where user_id = ${payee}
        `;
	}
	return { ok: true };
});
var cancelJob_createServerFn_handler = createServerRpc({
	id: "29db957cf4648afffedd458aefb61672e5bec8f4d58fb5be8594c5f063afc880",
	name: "cancelJob",
	filename: "src/lib/handypix-api.ts"
}, (opts) => cancelJob.__executeServer(opts));
var cancelJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(cancelJob_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job) throw new Error("Job not found");
	const accepted = await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
	const isOwner = job.homeowner_id === context.userId;
	const isPro = accepted[0]?.pro_id === context.userId;
	if (!isOwner && !isPro) throw new Error("Unauthorized");
	if (job.status === "complete" || job.status === "cancelled") throw new Error("This job is already closed");
	if (job.started_at) throw new Error("Work has started — open a dispute instead");
	await refundEscrow(sql, job.id, isOwner);
	await sql`update jobs set status = 'cancelled' where id = ${job.id}`;
	return { ok: true };
});
var requestChangeOrder_createServerFn_handler = createServerRpc({
	id: "4ecba637660cc9637db4f9b40c055312688141ed0d02d03cd1e8f14a2e42a887",
	name: "requestChangeOrder",
	filename: "src/lib/handypix-api.ts"
}, (opts) => requestChangeOrder.__executeServer(opts));
var requestChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(requestChangeOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job || job.status !== "in_progress" && job.status !== "awaiting_confirm") throw new Error("No active job");
	if ((await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `)[0]?.pro_id !== context.userId) throw new Error("Unauthorized");
	const labor = Math.max(0, Math.round(data.laborCents));
	const materials = Math.max(0, Math.round(data.materialsCents));
	if (labor + materials < 1e3) throw new Error("Enter a real additional amount");
	const id = newId("co");
	await sql`
      insert into change_orders (id, job_id, pro_id, reason, labor_cents, materials_cents, status)
      values (
        ${id}, ${job.id}, ${context.userId},
        ${data.reason.trim().slice(0, 400)}, ${labor}, ${materials}, 'pending'
      )
    `;
	return {
		ok: true,
		id
	};
});
var respondChangeOrder_createServerFn_handler = createServerRpc({
	id: "a813dccace21016a3a8bb6913f9332f5b1280f023f4dc4d23a6598923376a989",
	name: "respondChangeOrder",
	filename: "src/lib/handypix-api.ts"
}, (opts) => respondChangeOrder.__executeServer(opts));
var respondChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(respondChangeOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const co = (await sql`
      select id, job_id, pro_id, labor_cents, materials_cents, status
      from change_orders where id = ${data.changeOrderId} limit 1
    `)[0];
	if (!co || co.status !== "pending") throw new Error("Change order not found");
	const job = (await sql`select * from jobs where id = ${co.job_id} limit 1`)[0];
	if (!job || job.homeowner_id !== context.userId) throw new Error("Unauthorized");
	if (!data.approve) {
		await sql`update change_orders set status = 'declined' where id = ${co.id}`;
		return {
			ok: true,
			approved: false
		};
	}
	const extra = asNum(co.labor_cents) + asNum(co.materials_cents);
	try {
		await escrowPayment(sql, {
			jobId: job.id,
			payerId: context.userId,
			payeeId: co.pro_id,
			amountCents: extra,
			realPayer: true,
			note: "Additional work held until confirmation"
		});
	} catch (e) {
		if (e instanceof Error && e.message === "INSUFFICIENT_FUNDS") return {
			ok: false,
			error: "INSUFFICIENT_FUNDS"
		};
		throw e;
	}
	await sql`update change_orders set status = 'approved' where id = ${co.id}`;
	return {
		ok: true,
		approved: true
	};
});
var openDispute_createServerFn_handler = createServerRpc({
	id: "7a35d499d0ad6e326e3a3a12592d9cc9148c03e16574f2cbd80f693e9b930840",
	name: "openDispute",
	filename: "src/lib/handypix-api.ts"
}, (opts) => openDispute.__executeServer(opts));
var openDispute = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(openDispute_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job || job.homeowner_id !== context.userId) throw new Error("Unauthorized");
	if (job.status === "complete" || job.status === "cancelled") throw new Error("This job is closed");
	const existing = await sql`
      select id from disputes where job_id = ${job.id} and status = 'open' limit 1
    `;
	if (existing[0]) return {
		ok: true,
		id: existing[0].id
	};
	const id = newId("dsp");
	await sql`
      insert into disputes (id, job_id, opened_by, reason, details, status)
      values (
        ${id}, ${job.id}, ${context.userId},
        ${data.reason.slice(0, 40)}, ${data.details.trim().slice(0, 800)}, 'open'
      )
    `;
	return {
		ok: true,
		id
	};
});
var listThreads_createServerFn_handler = createServerRpc({
	id: "2f5d3f4c6af3d079dc6e84d4da63e713b7bee323ae908b201d6f10496648146d",
	name: "listThreads",
	filename: "src/lib/handypix-api.ts"
}, (opts) => listThreads.__executeServer(opts));
var listThreads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listThreads_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const jobs = await sql`
      select j.id, j.title, j.photo_url, j.status, j.homeowner_id, j.awarded_bid_id, j.poster_name
      from jobs j
      left join bids b on b.id = j.awarded_bid_id
      where j.homeowner_id = ${context.userId} or b.pro_id = ${context.userId}
      order by j.created_at desc
      limit 40
    `;
	const threads = [];
	for (const job of jobs) {
		if (job.status === "open" || job.status === "cancelled") continue;
		const last = await sql`
        select body, created_at, from_id from messages
        where job_id = ${job.id} order by created_at desc limit 1
      `;
		let otherName = job.poster_name;
		if (job.homeowner_id === context.userId && job.awarded_bid_id) {
			const pro = await sql`
          select pro_id from bids where id = ${job.awarded_bid_id} limit 1
        `;
			if (pro[0]) otherName = (await loadPro(sql, pro[0].pro_id)).displayName;
		}
		threads.push({
			jobId: job.id,
			title: job.title,
			photoUrl: job.photo_url,
			status: job.status,
			lastBody: last[0]?.body ?? "Job booked — say hello",
			lastAt: last[0]?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
			otherName
		});
	}
	return threads;
});
var listMessages_createServerFn_handler = createServerRpc({
	id: "8b4592a110660a71eaba89d0d4a85c97f139172466c3133cf6f0e6a117a2168e",
	name: "listMessages",
	filename: "src/lib/handypix-api.ts"
}, (opts) => listMessages.__executeServer(opts));
var listMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((jobId) => jobId).handler(listMessages_createServerFn_handler, async ({ context, data: jobId }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${jobId} limit 1`)[0];
	if (!job) return [];
	const accepted = await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
	if (!(job.homeowner_id === context.userId || accepted[0]?.pro_id === context.userId)) return [];
	const rows = await sql`
      select id, job_id, from_id, body, created_at
      from messages where job_id = ${jobId} order by created_at asc
    `;
	const out = [];
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
			mine: r.from_id === context.userId
		});
	}
	return out;
});
var sendMessage_createServerFn_handler = createServerRpc({
	id: "65b1df20a045a46dad81a57f215956d1a1aaee7a11c2d2702aca7e93b84bb142",
	name: "sendMessage",
	filename: "src/lib/handypix-api.ts"
}, (opts) => sendMessage.__executeServer(opts));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendMessage_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const job = (await sql`select * from jobs where id = ${data.jobId} limit 1`)[0];
	if (!job) throw new Error("Job not found");
	const accepted = await sql`
      select pro_id from bids where id = ${job.awarded_bid_id} limit 1
    `;
	if (!(job.homeowner_id === context.userId || accepted[0]?.pro_id === context.userId)) throw new Error("Unauthorized");
	const body = data.body.trim().slice(0, 500);
	if (!body) throw new Error("Write a message");
	const id = newId("msg");
	await sql`
      insert into messages (id, job_id, from_id, body)
      values (${id}, ${job.id}, ${context.userId}, ${body})
    `;
	return {
		ok: true,
		id
	};
});
var getProProfile_createServerFn_handler = createServerRpc({
	id: "bcf999454b038ca0640bb270f90f57d486fae49544a996b8e335b4ff53037941",
	name: "getProProfile",
	filename: "src/lib/handypix-api.ts"
}, (opts) => getProProfile.__executeServer(opts));
var getProProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getProProfile_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	const pro = await loadPro(sql, id);
	const jobs = await sql`
      select j.photo_url, j.title from bids b
      join jobs j on j.id = b.job_id
      where b.pro_id = ${id} and b.status = 'accepted' and j.photo_url <> ''
      order by j.created_at desc
      limit 4
    `;
	return {
		pro,
		portfolio: jobs.length > 0 ? jobs.map((j) => ({
			src: j.photo_url,
			caption: j.title
		})) : [{
			src: "/jobs/leaky-faucet.jpg",
			caption: "Fixture repair"
		}, {
			src: "/jobs/cracked-drywall.jpg",
			caption: "Interior repair"
		}]
	};
});
var addFunds_createServerFn_handler = createServerRpc({
	id: "879e5c1cbd9df8c98acc21217722e465cff21d247d4bfc32aa2e00de82e8052e",
	name: "addFunds",
	filename: "src/lib/handypix-api.ts"
}, (opts) => addFunds.__executeServer(opts));
var addFunds = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(addFunds_createServerFn_handler, async ({ context }) => {
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
var getWallet_createServerFn_handler = createServerRpc({
	id: "c9a4bb6bd749cfaa622ff1f3871be19f02bddd9500103d8c209d6bc20441289c",
	name: "getWallet",
	filename: "src/lib/handypix-api.ts"
}, (opts) => getWallet.__executeServer(opts));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWallet_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return {
		profile: await requireProfile(sql, context.userId),
		events: (await sql`
      select id, amount_cents, kind, job_id, note, created_at
      from wallet_events where user_id = ${context.userId}
      order by created_at desc
      limit 30
    `).map((e) => ({
			id: e.id,
			amountCents: asNum(e.amount_cents),
			kind: e.kind,
			jobId: e.job_id,
			note: e.note,
			createdAt: e.created_at
		}))
	};
});
var getBidCheckout_createServerFn_handler = createServerRpc({
	id: "2f48f6cc4552f4b044f1c42936daf1f1220c68d7665673f93d80567abff0b7bf",
	name: "getBidCheckout",
	filename: "src/lib/handypix-api.ts"
}, (opts) => getBidCheckout.__executeServer(opts));
var getBidCheckout = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((bidId) => bidId).handler(getBidCheckout_createServerFn_handler, async ({ context, data: bidId }) => {
	const sql = await getSql();
	const bid = (await sql`
      select id, job_id, pro_id, amount_cents, message, eta_days,
             materials_included, status, created_at,
             labor_cents, materials_cents, warranty_days, duration_minutes,
             available_window, distance_miles
      from bids where id = ${bidId} limit 1
    `)[0];
	if (!bid) return null;
	const job = (await sql`select * from jobs where id = ${bid.job_id} limit 1`)[0];
	if (!job || job.homeowner_id !== context.userId) return null;
	const mappedBids = await mapBids(sql, [bid]);
	return {
		job: mapJob(job),
		bid: mappedBids[0]
	};
});
//#endregion
export { addFunds_createServerFn_handler, cancelJob_createServerFn_handler, completeOnboarding_createServerFn_handler, confirmDiagnosis_createServerFn_handler, confirmJobComplete_createServerFn_handler, createBid_createServerFn_handler, diagnosePhoto_createServerFn_handler, getBidCheckout_createServerFn_handler, getDiagnosis_createServerFn_handler, getJobDetail_createServerFn_handler, getMyProfile_createServerFn_handler, getProProfile_createServerFn_handler, getWallet_createServerFn_handler, hireBid_createServerFn_handler, listMarketJobs_createServerFn_handler, listMessages_createServerFn_handler, listMyBids_createServerFn_handler, listMyDiagnoses_createServerFn_handler, listMyJobs_createServerFn_handler, listThreads_createServerFn_handler, markJobComplete_createServerFn_handler, markOnTheWay_createServerFn_handler, openDispute_createServerFn_handler, postJobFromDiagnosis_createServerFn_handler, requestChangeOrder_createServerFn_handler, respondChangeOrder_createServerFn_handler, sendMessage_createServerFn_handler, startJob_createServerFn_handler, updateProfile_createServerFn_handler };
