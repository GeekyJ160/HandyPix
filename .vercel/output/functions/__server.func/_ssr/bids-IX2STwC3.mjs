import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { y as listMyBids } from "./handypix-api-vStLCUsM.mjs";
import { i as formatUsd, n as Skeleton, s as relativeTime, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Badge } from "./badge-BIq6MIey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bids-IX2STwC3.js
var import_jsx_runtime = require_jsx_runtime();
function BidsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BidsBody, {}) });
}
function BidsBody() {
	const bids = useQuery({
		queryKey: ["bids"],
		queryFn: () => listMyBids()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: "Your bids"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Track pending, hired, and closed work."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-3",
			children: bids.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-[22px]" }) : (bids.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]",
				children: "You have not bid yet. Open the market to find work."
			}) : bids.data.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/jobs/$id",
				params: { id: b.jobId },
				className: "flex gap-3 rounded-[22px] bg-surface p-2 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: b.photoUrl,
					alt: "",
					className: "size-20 rounded-[14px] object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 py-1 pr-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BidStatus, { status: b.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: CATEGORY_LABEL[b.category ?? "other"] ?? b.category
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate font-medium",
							children: b.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								formatUsd(b.amountCents),
								" · ",
								b.zip,
								" · ",
								relativeTime(b.createdAt)
							]
						})
					]
				})]
			}, b.id))
		})
	] });
}
function BidStatus({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: status === "accepted" ? "success" : status === "declined" || status === "withdrawn" ? "danger" : "neutral",
		children: status
	});
}
//#endregion
export { BidsPage as component };
