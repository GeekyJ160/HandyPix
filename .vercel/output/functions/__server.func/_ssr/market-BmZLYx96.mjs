import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as CATEGORIES, o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { _ as listMarketJobs } from "./handypix-api-vStLCUsM.mjs";
import { n as Skeleton, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as JobCard } from "./job-card-DzPANCt_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-BmZLYx96.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketBody, {}) });
}
function MarketBody() {
	const [category, setCategory] = (0, import_react.useState)("all");
	const jobs = useQuery({
		queryKey: ["market", category],
		queryFn: () => listMarketJobs({ data: { category } })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: "Market"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Open jobs around Dallas–Fort Worth. Bid with a firm price."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex gap-2 overflow-x-auto pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				label: "All",
				active: category === "all",
				onClick: () => setCategory("all")
			}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				label: CATEGORY_LABEL[c],
				active: category === c,
				onClick: () => setCategory(c)
			}, c))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-3",
			children: jobs.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-[22px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-[22px]" })] }) : (jobs.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]",
				children: "No open jobs in this trade right now."
			}) : jobs.data.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
				job,
				href: "/jobs/$id"
			}, job.id))
		})
	] });
}
function FilterChip({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-medium", active ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
		children: label
	});
}
//#endregion
export { MarketPage as component };
