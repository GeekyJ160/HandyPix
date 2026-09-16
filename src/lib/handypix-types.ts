export const CATEGORIES = [
  "plumbing",
  "electrical",
  "hvac",
  "painting",
  "carpentry",
  "appliance",
  "roofing",
  "flooring",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SEVERITIES = ["low", "medium", "high", "emergency"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SAFETY_LEVELS = ["normal", "caution", "danger"] as const;
export type SafetyLevel = (typeof SAFETY_LEVELS)[number];

export const COMPLEXITIES = ["small", "standard", "larger"] as const;
export type Complexity = (typeof COMPLEXITIES)[number];

export const JOB_STATUSES = [
  "open",
  "in_progress",
  "awaiting_confirm",
  "complete",
  "cancelled",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const URGENCIES = ["emergency", "soon", "flexible"] as const;
export type Urgency = (typeof URGENCIES)[number];

export const TIME_WINDOWS = ["morning", "afternoon", "evening", "flexible"] as const;
export type TimeWindow = (typeof TIME_WINDOWS)[number];

export const BUDGET_BANDS = [
  "under100",
  "100_250",
  "250_500",
  "500_plus",
  "unknown",
] as const;
export type BudgetBand = (typeof BUDGET_BANDS)[number];

export type Role = "homeowner" | "pro";

export type DiagnosisPart = {
  name: string;
  est_cost_cents: number;
};

export type DiagnosisResult = {
  issue: string;
  category: Category;
  severity: Severity;
  summary: string;
  likely_cause: string;
  diy_possible: boolean;
  diy_difficulty: "easy" | "moderate" | "advanced" | "pro-only";
  diy_steps: string[];
  tools_needed: string[];
  parts: DiagnosisPart[];
  safety_notes: string[];
  when_to_call_pro: string;
  est_labor_hours: number;
  est_cost_min_cents: number;
  est_cost_max_cents: number;
  confidence: number;
  observations: string[];
  follow_up_question: string;
  follow_up_options: string[];
  follow_up_answer: string;
  safety_level: SafetyLevel;
  complexity: Complexity;
};

export type Profile = {
  userId: string;
  role: Role;
  displayName: string;
  city: string;
  zip: string;
  bio: string;
  trades: Category[];
  hourlyRateCents: number;
  ratingX10: number;
  jobsCompleted: number;
  walletCents: number;
  createdAt: string;
};

export type DiagnosisRow = {
  id: string;
  userId: string;
  jobId: string | null;
  photoUrl: string;
  photoUrls: string[];
  result: DiagnosisResult;
  createdAt: string;
};

export type JobRow = {
  id: string;
  homeownerId: string;
  posterName: string;
  title: string;
  description: string;
  category: Category;
  photoUrl: string;
  diagnosis: DiagnosisResult | null;
  status: JobStatus;
  urgency: Urgency;
  zip: string;
  budgetMinCents: number;
  budgetMaxCents: number;
  awardedBidId: string | null;
  isSeed: boolean;
  autoAward: boolean;
  bidCount: number;
  createdAt: string;
  preferredDate: string | null;
  timeWindow: TimeWindow;
  budgetBand: BudgetBand;
  awardedAt: string | null;
  onTheWayAt: string | null;
  startedAt: string | null;
  workPerformed: string;
  afterPhotoUrl: string;
};

export type ProReview = {
  author: string;
  rating: number;
  comment: string;
  tags: string[];
};

export type ProSummary = {
  id: string;
  displayName: string;
  city: string;
  zip: string;
  trades: Category[];
  bio: string;
  hourlyRateCents: number;
  ratingX10: number;
  jobsCompleted: number;
  yearsExp: number;
  identityVerified: boolean;
  insurance: boolean;
  backgroundCheck: boolean;
  distanceMiles: number;
  reviews: ProReview[];
};

export type BidRow = {
  id: string;
  jobId: string;
  proId: string;
  amountCents: number;
  message: string;
  etaDays: number;
  materialsIncluded: boolean;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  createdAt: string;
  laborCents: number;
  materialsCents: number;
  warrantyDays: number;
  durationMinutes: number;
  availableWindow: string;
  distanceMiles: number;
  pro: ProSummary;
};

export type PaymentRow = {
  id: string;
  jobId: string;
  payerId: string;
  payeeId: string;
  amountCents: number;
  feeCents: number;
  status: "escrowed" | "released" | "refunded";
  createdAt: string;
  releasedAt: string | null;
};

export type WalletEvent = {
  id: string;
  amountCents: number;
  kind: string;
  jobId: string | null;
  note: string;
  createdAt: string;
};

export type MessageRow = {
  id: string;
  jobId: string;
  fromId: string;
  fromName: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

export type MessageThread = {
  jobId: string;
  title: string;
  photoUrl: string;
  status: JobStatus;
  lastBody: string;
  lastAt: string;
  otherName: string;
};

export type ChangeOrderRow = {
  id: string;
  jobId: string;
  proId: string;
  reason: string;
  laborCents: number;
  materialsCents: number;
  status: "pending" | "approved" | "declined";
  createdAt: string;
};

export type DisputeRow = {
  id: string;
  jobId: string;
  openedBy: string;
  reason: string;
  details: string;
  status: "open" | "resolved";
  createdAt: string;
};

export const PLATFORM_FEE_BPS = 800;
export const HOMEOWNER_STARTING_CENTS = 250_000;
export const TOP_UP_CENTS = 50_000;

export const CATEGORY_LABEL: Record<Category, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  hvac: "HVAC",
  painting: "Painting",
  carpentry: "Carpentry",
  appliance: "Appliances",
  roofing: "Roofing",
  flooring: "Flooring",
  other: "General",
};

export const HOME_CATEGORIES: { id: Category; label: string }[] = [
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "hvac", label: "HVAC" },
  { id: "carpentry", label: "Carpentry" },
  { id: "carpentry", label: "Drywall" },
  { id: "painting", label: "Painting" },
  { id: "appliance", label: "Appliances" },
  { id: "other", label: "Doors & Windows" },
  { id: "other", label: "Furniture" },
  { id: "other", label: "General" },
];

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  medium: "Moderate",
  high: "High",
  emergency: "Emergency",
};

export const SAFETY_COPY: Record<
  SafetyLevel,
  { title: string; body: string; tone: "success" | "warn" | "danger" }
> = {
  normal: {
    title: "Routine repair",
    body: "This looks like a contained household issue. A professional should still verify before work starts.",
    tone: "success",
  },
  caution: {
    title: "Professional inspection recommended",
    body: "A licensed trade should inspect this before any repair. Do not treat the AI read as a guarantee.",
    tone: "warn",
  },
  danger: {
    title: "Potentially dangerous",
    body: "Stop and treat this as a safety issue. If you smell gas, see fire, or the structure is failing, leave and call emergency services. HandyPix will not bid this as a routine job.",
    tone: "danger",
  },
};

export const COMPLEXITY_LABEL: Record<Complexity, string> = {
  small: "Small repair",
  standard: "Standard job",
  larger: "Larger project",
};

export const STATUS_LABEL: Record<JobStatus, string> = {
  open: "Open for bids",
  in_progress: "Booked",
  awaiting_confirm: "Work submitted",
  complete: "Complete",
  cancelled: "Cancelled",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  emergency: "Emergency — today",
  soon: "This week",
  flexible: "Flexible",
};

export const TIME_WINDOW_LABEL: Record<TimeWindow, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  flexible: "Flexible",
};

export const BUDGET_BAND_LABEL: Record<BudgetBand, string> = {
  under100: "Under $100",
  "100_250": "$100–$250",
  "250_500": "$250–$500",
  "500_plus": "$500+",
  unknown: "Not sure",
};

export const BUDGET_BAND_RANGE: Record<BudgetBand, { min: number; max: number }> = {
  under100: { min: 4000, max: 10000 },
  "100_250": { min: 10000, max: 25000 },
  "250_500": { min: 25000, max: 50000 },
  "500_plus": { min: 50000, max: 250000 },
  unknown: { min: 0, max: 0 },
};

export const REVIEW_TAGS = [
  { id: "on_time", label: "On time" },
  { id: "professional", label: "Professional" },
  { id: "communication", label: "Good communication" },
  { id: "quality", label: "Quality work" },
  { id: "fair_pricing", label: "Fair pricing" },
] as const;

export const DISPUTE_REASONS = [
  { id: "not_completed", label: "Job was not completed" },
  { id: "differs", label: "Work differs from the agreement" },
  { id: "damage", label: "Damage occurred" },
  { id: "unexpected_price", label: "Unexpected price" },
  { id: "no_show", label: "Handyman did not arrive" },
  { id: "other", label: "Other issue" },
] as const;

export const SAMPLE_SCANS = [
  {
    id: "faucet",
    src: "/jobs/leaky-faucet.jpg",
    label: "Leaky faucet",
    hint: "Kitchen · plumbing",
  },
  {
    id: "outlet",
    src: "/jobs/outlet.jpg",
    label: "Scorched outlet",
    hint: "Hallway · electrical",
  },
  {
    id: "drywall",
    src: "/jobs/cracked-drywall.jpg",
    label: "Cracked drywall",
    hint: "Living room · carpentry",
  },
  {
    id: "hvac",
    src: "/jobs/hvac.jpg",
    label: "HVAC condenser",
    hint: "Yard · cooling",
  },
] as const;

export const CATEGORY_FOLLOW_UP: Record<
  Category,
  { question: string; options: string[] }
> = {
  plumbing: {
    question: "When does the leak occur?",
    options: ["Constantly", "Only when the fixture runs", "Only after rain", "Not sure"],
  },
  electrical: {
    question: "Is the breaker tripping or does it feel warm?",
    options: ["Breaker trips", "Outlet or switch is warm", "No power", "Not sure"],
  },
  hvac: {
    question: "How long has cooling or heat been off?",
    options: ["Today", "A few days", "More than a week", "Not sure"],
  },
  carpentry: {
    question: "Is this a safety issue or cosmetic?",
    options: ["Someone could get hurt", "Getting worse", "Mostly cosmetic", "Not sure"],
  },
  painting: {
    question: "How large is the area?",
    options: ["A patch", "One wall", "A whole room", "Not sure"],
  },
  appliance: {
    question: "Does the appliance still run?",
    options: ["Yes, with a fault", "No, it is dead", "Intermittent", "Not sure"],
  },
  roofing: {
    question: "Is water actively coming in?",
    options: ["Yes, right now", "Only when it rains", "Just a stain", "Not sure"],
  },
  flooring: {
    question: "Is the floor soft or just surface damage?",
    options: ["Soft or spongy", "Surface only", "Trip hazard", "Not sure"],
  },
  other: {
    question: "How urgent is this for you?",
    options: ["Today", "This week", "Whenever it is convenient", "Not sure"],
  },
};
