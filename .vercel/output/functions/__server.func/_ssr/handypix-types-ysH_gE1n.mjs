//#region node_modules/.nitro/vite/services/ssr/assets/handypix-types-ysH_gE1n.js
var CATEGORIES = [
	"plumbing",
	"electrical",
	"hvac",
	"painting",
	"carpentry",
	"appliance",
	"roofing",
	"flooring",
	"other"
];
var SEVERITIES = [
	"low",
	"medium",
	"high",
	"emergency"
];
var SAFETY_LEVELS = [
	"normal",
	"caution",
	"danger"
];
var COMPLEXITIES = [
	"small",
	"standard",
	"larger"
];
var URGENCIES = [
	"emergency",
	"soon",
	"flexible"
];
var TIME_WINDOWS = [
	"morning",
	"afternoon",
	"evening",
	"flexible"
];
var BUDGET_BANDS = [
	"under100",
	"100_250",
	"250_500",
	"500_plus",
	"unknown"
];
var HOMEOWNER_STARTING_CENTS = 25e4;
var TOP_UP_CENTS = 5e4;
var CATEGORY_LABEL = {
	plumbing: "Plumbing",
	electrical: "Electrical",
	hvac: "HVAC",
	painting: "Painting",
	carpentry: "Carpentry",
	appliance: "Appliances",
	roofing: "Roofing",
	flooring: "Flooring",
	other: "General"
};
var HOME_CATEGORIES = [
	{
		id: "plumbing",
		label: "Plumbing"
	},
	{
		id: "electrical",
		label: "Electrical"
	},
	{
		id: "hvac",
		label: "HVAC"
	},
	{
		id: "carpentry",
		label: "Carpentry"
	},
	{
		id: "carpentry",
		label: "Drywall"
	},
	{
		id: "painting",
		label: "Painting"
	},
	{
		id: "appliance",
		label: "Appliances"
	},
	{
		id: "other",
		label: "Doors & Windows"
	},
	{
		id: "other",
		label: "Furniture"
	},
	{
		id: "other",
		label: "General"
	}
];
var SEVERITY_LABEL = {
	low: "Low",
	medium: "Moderate",
	high: "High",
	emergency: "Emergency"
};
var SAFETY_COPY = {
	normal: {
		title: "Routine repair",
		body: "This looks like a contained household issue. A professional should still verify before work starts.",
		tone: "success"
	},
	caution: {
		title: "Professional inspection recommended",
		body: "A licensed trade should inspect this before any repair. Do not treat the AI read as a guarantee.",
		tone: "warn"
	},
	danger: {
		title: "Potentially dangerous",
		body: "Stop and treat this as a safety issue. If you smell gas, see fire, or the structure is failing, leave and call emergency services. HandyPix will not bid this as a routine job.",
		tone: "danger"
	}
};
var COMPLEXITY_LABEL = {
	small: "Small repair",
	standard: "Standard job",
	larger: "Larger project"
};
var STATUS_LABEL = {
	open: "Open for bids",
	in_progress: "Booked",
	awaiting_confirm: "Work submitted",
	complete: "Complete",
	cancelled: "Cancelled"
};
var URGENCY_LABEL = {
	emergency: "Emergency — today",
	soon: "This week",
	flexible: "Flexible"
};
var TIME_WINDOW_LABEL = {
	morning: "Morning",
	afternoon: "Afternoon",
	evening: "Evening",
	flexible: "Flexible"
};
var BUDGET_BAND_LABEL = {
	under100: "Under $100",
	"100_250": "$100–$250",
	"250_500": "$250–$500",
	"500_plus": "$500+",
	unknown: "Not sure"
};
var BUDGET_BAND_RANGE = {
	under100: {
		min: 4e3,
		max: 1e4
	},
	"100_250": {
		min: 1e4,
		max: 25e3
	},
	"250_500": {
		min: 25e3,
		max: 5e4
	},
	"500_plus": {
		min: 5e4,
		max: 25e4
	},
	unknown: {
		min: 0,
		max: 0
	}
};
var REVIEW_TAGS = [
	{
		id: "on_time",
		label: "On time"
	},
	{
		id: "professional",
		label: "Professional"
	},
	{
		id: "communication",
		label: "Good communication"
	},
	{
		id: "quality",
		label: "Quality work"
	},
	{
		id: "fair_pricing",
		label: "Fair pricing"
	}
];
var DISPUTE_REASONS = [
	{
		id: "not_completed",
		label: "Job was not completed"
	},
	{
		id: "differs",
		label: "Work differs from the agreement"
	},
	{
		id: "damage",
		label: "Damage occurred"
	},
	{
		id: "unexpected_price",
		label: "Unexpected price"
	},
	{
		id: "no_show",
		label: "Handyman did not arrive"
	},
	{
		id: "other",
		label: "Other issue"
	}
];
var SAMPLE_SCANS = [
	{
		id: "faucet",
		src: "/jobs/leaky-faucet.jpg",
		label: "Leaky faucet",
		hint: "Kitchen · plumbing"
	},
	{
		id: "outlet",
		src: "/jobs/outlet.jpg",
		label: "Scorched outlet",
		hint: "Hallway · electrical"
	},
	{
		id: "drywall",
		src: "/jobs/cracked-drywall.jpg",
		label: "Cracked drywall",
		hint: "Living room · carpentry"
	},
	{
		id: "hvac",
		src: "/jobs/hvac.jpg",
		label: "HVAC condenser",
		hint: "Yard · cooling"
	}
];
var CATEGORY_FOLLOW_UP = {
	plumbing: {
		question: "When does the leak occur?",
		options: [
			"Constantly",
			"Only when the fixture runs",
			"Only after rain",
			"Not sure"
		]
	},
	electrical: {
		question: "Is the breaker tripping or does it feel warm?",
		options: [
			"Breaker trips",
			"Outlet or switch is warm",
			"No power",
			"Not sure"
		]
	},
	hvac: {
		question: "How long has cooling or heat been off?",
		options: [
			"Today",
			"A few days",
			"More than a week",
			"Not sure"
		]
	},
	carpentry: {
		question: "Is this a safety issue or cosmetic?",
		options: [
			"Someone could get hurt",
			"Getting worse",
			"Mostly cosmetic",
			"Not sure"
		]
	},
	painting: {
		question: "How large is the area?",
		options: [
			"A patch",
			"One wall",
			"A whole room",
			"Not sure"
		]
	},
	appliance: {
		question: "Does the appliance still run?",
		options: [
			"Yes, with a fault",
			"No, it is dead",
			"Intermittent",
			"Not sure"
		]
	},
	roofing: {
		question: "Is water actively coming in?",
		options: [
			"Yes, right now",
			"Only when it rains",
			"Just a stain",
			"Not sure"
		]
	},
	flooring: {
		question: "Is the floor soft or just surface damage?",
		options: [
			"Soft or spongy",
			"Surface only",
			"Trip hazard",
			"Not sure"
		]
	},
	other: {
		question: "How urgent is this for you?",
		options: [
			"Today",
			"This week",
			"Whenever it is convenient",
			"Not sure"
		]
	}
};
//#endregion
export { URGENCY_LABEL as C, URGENCIES as S, SEVERITY_LABEL as _, CATEGORY_FOLLOW_UP as a, TIME_WINDOW_LABEL as b, COMPLEXITY_LABEL as c, HOME_CATEGORIES as d, REVIEW_TAGS as f, SEVERITIES as g, SAMPLE_SCANS as h, CATEGORIES as i, DISPUTE_REASONS as l, SAFETY_LEVELS as m, BUDGET_BAND_LABEL as n, CATEGORY_LABEL as o, SAFETY_COPY as p, BUDGET_BAND_RANGE as r, COMPLEXITIES as s, BUDGET_BANDS as t, HOMEOWNER_STARTING_CENTS as u, STATUS_LABEL as v, TOP_UP_CENTS as x, TIME_WINDOWS as y };
