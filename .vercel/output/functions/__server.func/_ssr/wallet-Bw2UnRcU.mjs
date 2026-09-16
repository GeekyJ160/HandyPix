import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient } from "./router-BJk2OPSE.mjs";
import { h as getWallet, r as addFunds } from "./handypix-api-vStLCUsM.mjs";
import { a as formatUsdExact, n as Skeleton, s as relativeTime, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-Bw2UnRcU.js
var import_jsx_runtime = require_jsx_runtime();
function WalletPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletBody, {}) });
}
function WalletBody() {
	const wallet = useQuery({
		queryKey: ["wallet"],
		queryFn: () => getWallet()
	});
	const topUp = useMutation({
		mutationFn: () => addFunds(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Added $500 demo funds");
		}
	});
	if (wallet.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full rounded-[24px]" });
	if (!wallet.data) return null;
	const { profile, events } = wallet.data;
	const isPro = profile.role === "pro";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: isPro ? "Earnings" : "Wallet"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-[28px] bg-surface p-6 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-subtle",
					children: "Available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-4xl font-semibold tabular-nums tracking-tight",
					children: formatUsdExact(profile.walletCents)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: isPro ? "Payouts land here when a homeowner confirms the job." : "Used to hire. Funds sit in escrow until you confirm the work."
				}),
				!isPro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5",
					variant: "secondary",
					onClick: () => topUp.mutate(),
					disabled: topUp.isPending,
					children: "Add $500 demo funds"
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-lg font-semibold",
			children: "Activity"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-border",
			children: events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-6 text-sm text-muted",
				children: "No movement yet."
			}) : events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: e.note || e.kind
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: relativeTime(e.createdAt)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("tabular-nums text-sm font-medium", e.amountCents < 0 ? "text-muted" : "text-success"),
					children: [e.amountCents > 0 ? "+" : "", formatUsdExact(e.amountCents)]
				})]
			}, e.id))
		})
	] });
}
//#endregion
export { WalletPage as component };
