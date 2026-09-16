import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { b as TIME_WINDOW_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient, i as Route$4 } from "./router-BJk2OPSE.mjs";
import { g as hireBid, p as getMyProfile, r as addFunds, u as getBidCheckout } from "./handypix-api-vStLCUsM.mjs";
import { a as formatUsdExact, i as formatUsd, n as Skeleton, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hire._bidId-DFSTza1k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HirePage() {
	const { bidId } = Route$4.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HireBody, { bidId }) });
}
function HireBody({ bidId }) {
	const navigate = useNavigate();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const checkout = useQuery({
		queryKey: ["checkout", bidId],
		queryFn: () => getBidCheckout({ data: bidId })
	});
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const hire = useMutation({
		mutationFn: () => hireBid({ data: { bidId } }),
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error("Not enough in the wallet");
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			queryClient.invalidateQueries({ queryKey: ["job"] });
			queryClient.invalidateQueries({ queryKey: ["messages"] });
			toast.success("Booked. Funds are held until you confirm the work.");
			navigate({
				to: "/jobs/$id",
				params: { id: res.jobId }
			});
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not hire")
	});
	const topUp = useMutation({
		mutationFn: () => addFunds(),
		onSuccess: (p) => {
			queryClient.setQueryData(["profile"], p);
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			toast.success("Added $500 demo funds");
		}
	});
	if (checkout.isPending || profile.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-[24px]" });
	if (!checkout.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "That bid is no longer available."
	});
	const { job, bid } = checkout.data;
	const fee = Math.round(bid.amountCents * 800 / 1e4);
	const wallet = profile.data?.walletCents ?? 0;
	const short = wallet < bid.amountCents;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-accent",
			children: "Confirm & pay"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "mt-2 font-display text-3xl font-semibold tracking-tight",
			children: ["Hire ", bid.pro.displayName]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				job.title,
				job.preferredDate ? ` · ${job.preferredDate}` : "",
				" · ",
				TIME_WINDOW_LABEL[job.timeWindow]
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				bid.availableWindow || "Window to be confirmed",
				" · ",
				bid.warrantyDays,
				"-day warranty"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Labor",
					value: formatUsdExact(bid.laborCents),
					muted: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Materials",
					value: formatUsdExact(bid.materialsCents),
					muted: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Job estimate",
					value: formatUsdExact(bid.amountCents)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Platform fee (8%, withheld at release)",
					value: formatUsdExact(fee),
					muted: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Pro receives after confirm",
					value: formatUsdExact(bid.amountCents - fee)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Authorized now",
					value: formatUsdExact(bid.amountCents)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Your wallet",
					value: formatUsdExact(wallet)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.14em] text-subtle",
				children: "Payment method"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: "Visa ···· 4242 (demo wallet)"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs leading-relaxed text-subtle",
			children: "Authorization holds the bid amount until you confirm the work. This is not a licensed escrow service — the ledger is a marketplace hold on a demo wallet. Swap this for Stripe Connect in production."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 flex min-h-11 items-start gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				className: "mt-1",
				checked: agreed,
				onChange: (e) => setAgreed(e.target.checked)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I agree to the service terms. Address is shared with the hired pro only." })]
		}),
		short ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: "Add funds to cover this hire."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: () => topUp.mutate(),
				disabled: topUp.isPending,
				children: "Add $500 demo funds"
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4 w-full",
			size: "lg",
			disabled: short || hire.isPending || !agreed,
			onClick: () => hire.mutate(),
			children: hire.isPending ? "Holding funds…" : `Pay & book ${formatUsd(bid.amountCents)}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "ghost",
			className: "mt-2 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/jobs/$id",
				params: { id: job.id },
				children: "Back to bids"
			})
		})
	] });
}
function Row({ label, value, muted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: muted ? "text-muted" : "",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums font-medium",
			children: value
		})]
	});
}
//#endregion
export { HirePage as component };
