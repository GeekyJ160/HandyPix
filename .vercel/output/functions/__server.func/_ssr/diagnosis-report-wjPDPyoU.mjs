import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as COMPLEXITY_LABEL, o as CATEGORY_LABEL, p as SAFETY_COPY } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { c as Shield, l as ShieldCheck, n as Wrench, o as TriangleAlert, v as Hammer, y as Clock } from "../_libs/lucide-react.mjs";
import { i as formatUsd } from "./app-shell-B1Ywie2_.mjs";
import { t as SeverityBadge } from "./status-Bd20Goar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnosis-report-wjPDPyoU.js
var import_jsx_runtime = require_jsx_runtime();
function SafetyBanner({ level }) {
	const copy = SAFETY_COPY[level];
	const Icon = level === "danger" ? TriangleAlert : level === "caution" ? Shield : ShieldCheck;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-[20px] p-4", level === "danger" && "bg-danger/12", level === "caution" && "bg-warn/12", level === "normal" && "bg-success/12"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: cn("flex items-center gap-2 text-sm font-semibold", level === "danger" && "text-danger", level === "caution" && "text-warn", level === "normal" && "text-success"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), copy.title]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm leading-relaxed text-fg/90",
				children: copy.body
			}),
			level === "danger" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "tel:911",
				className: "mt-3 inline-flex h-11 items-center rounded-[12px] bg-danger px-4 text-sm font-medium text-fg",
				children: "Call 911"
			}) : null
		]
	});
}
function DiagnosisReport({ result }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { value: result.severity }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: CATEGORY_LABEL[result.category]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: COMPLEXITY_LABEL[result.complexity]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-subtle",
							children: [result.confidence, "% confidence"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-semibold tracking-tight",
					children: result.issue
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: result.summary
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafetyBanner, { level: result.safety_level }),
			result.observations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "What we see"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1.5 text-sm text-muted",
					children: result.observations.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
						label: "Labor",
						value: `${result.est_labor_hours} hrs`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }),
						label: "Est. range",
						value: `${formatUsd(result.est_cost_min_cents)}–${formatUsd(result.est_cost_max_cents)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "size-4" }),
						label: "DIY",
						value: result.diy_possible ? result.diy_difficulty : "Call a pro"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Likely cause"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: result.likely_cause
				})]
			}),
			result.diy_possible && result.diy_steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "If you DIY"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-2 space-y-2",
				children: result.diy_steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-fg",
						children: i + 1
					}), step]
				}, step))
			})] }) : result.when_to_call_pro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: result.when_to_call_pro
			}) : null,
			result.parts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Likely parts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-border",
				children: result.parts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: formatUsd(p.est_cost_cents)
					})]
				}, p.name))
			})] }) : null,
			result.tools_needed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: ["Tools: ", result.tools_needed.join(", ")]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-subtle",
				children: "AI assessment: this is a preliminary visual read and may be wrong. A professional should verify the problem before repair."
			})
		]
	});
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] bg-surface p-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-subtle",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-sm font-semibold tracking-tight",
			children: value
		})]
	});
}
//#endregion
export { DiagnosisReport as t };
