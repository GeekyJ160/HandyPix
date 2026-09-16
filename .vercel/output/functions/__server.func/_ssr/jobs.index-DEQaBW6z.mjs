import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { x as listMyJobs } from "./handypix-api-vStLCUsM.mjs";
import { n as Skeleton, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { t as JobCard } from "./job-card-DzPANCt_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs.index-DEQaBW6z.js
var import_jsx_runtime = require_jsx_runtime();
function JobsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobsBody, {}) });
}
function JobsBody() {
	const jobs = useQuery({
		queryKey: ["jobs"],
		queryFn: () => listMyJobs()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: "Your jobs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Open listings, hired work, and history."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-3",
			children: jobs.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-[22px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-[22px]" })] }) : (jobs.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[22px] bg-surface p-6 text-center shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "You have not posted a job yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/scan",
						children: "Snap a problem"
					})
				})]
			}) : jobs.data.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
				job,
				href: "/jobs/$id"
			}, job.id))
		})
	] });
}
//#endregion
export { JobsPage as component };
