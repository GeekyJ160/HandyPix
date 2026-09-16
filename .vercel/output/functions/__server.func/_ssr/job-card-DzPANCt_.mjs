import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { p as MapPin } from "../_libs/lucide-react.mjs";
import { i as formatUsd, s as relativeTime } from "./app-shell-B1Ywie2_.mjs";
import { n as StatusBadge, r as UrgencyBadge } from "./status-Bd20Goar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/job-card-DzPANCt_.js
var import_jsx_runtime = require_jsx_runtime();
function JobCard({ job, href }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		params: { id: job.id },
		className: "group flex gap-3 rounded-[22px] bg-surface p-2 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-150 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_18%,transparent)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: job.photoUrl,
			alt: "",
			className: "size-24 shrink-0 rounded-[14px] object-cover sm:size-28"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1 py-1.5 pr-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: job.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { value: job.urgency })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1.5 truncate font-display text-base font-semibold tracking-tight",
					children: job.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-xs text-muted",
					children: [
						CATEGORY_LABEL[job.category],
						" · ",
						formatUsd(job.budgetMinCents),
						"–",
						formatUsd(job.budgetMaxCents)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-3 text-xs text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), job.zip]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [job.bidCount, " bids"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: relativeTime(job.createdAt) })
					]
				})
			]
		})]
	});
}
//#endregion
export { JobCard as t };
