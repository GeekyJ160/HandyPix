import { f as useRouterState, x as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn, t as Logo } from "./logo-DvvhPUKJ.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { _ as House, a as UserRound, b as ClipboardList, f as MessageSquare, h as LayoutGrid, r as Wallet, w as Briefcase } from "../_libs/lucide-react.mjs";
import { n as UserButton, p as getMyProfile, t as RedirectToSignIn } from "./handypix-api-vStLCUsM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-B1Ywie2_.js
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-[12px] bg-surface-2", className),
		"aria-hidden": "true"
	});
}
function formatUsd(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	}).format(Math.round(cents / 100));
}
function formatUsdExact(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function formatRating(ratingX10) {
	return (ratingX10 / 10).toFixed(1);
}
function relativeTime(iso) {
	const delta = Date.now() - new Date(iso).getTime();
	const mins = Math.round(delta / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	if (days < 14) return `${days}d ago`;
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "P";
}
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const profileQuery = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profileQuery.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	if (!profileQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellFrame, {
		profile: profileQuery.data,
		children
	});
}
function ShellFrame({ profile, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const items = navFor(profile.role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-bg px-4 py-5 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/home",
						className: "px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 flex flex-1 flex-col gap-1",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							item,
							pathname
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/blueprint",
						className: "rounded-[12px] px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-fg",
						children: "Product blueprint"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/home",
						className: "md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { markClassName: "size-7" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wallet",
							className: "rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium tabular-nums text-fg shadow-[var(--shadow-border)]",
							children: formatUsd(profile.walletCents)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-3xl px-4 pb-28 pt-6 md:pb-12",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-lg grid-cols-5",
					children: items.map((item) => {
						const active = isActive(pathname, item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px]", active ? "text-accent" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
function navFor(role) {
	if (role === "pro") return [
		{
			to: "/market",
			label: "Jobs",
			icon: LayoutGrid
		},
		{
			to: "/bids",
			label: "Bids",
			icon: ClipboardList
		},
		{
			to: "/messages",
			label: "Messages",
			icon: MessageSquare
		},
		{
			to: "/wallet",
			label: "Earnings",
			icon: Wallet
		},
		{
			to: "/profile",
			label: "Profile",
			icon: UserRound
		}
	];
	return [
		{
			to: "/home",
			label: "Home",
			icon: House
		},
		{
			to: "/jobs",
			label: "Jobs",
			icon: Briefcase
		},
		{
			to: "/messages",
			label: "Messages",
			icon: MessageSquare
		},
		{
			to: "/wallet",
			label: "Wallet",
			icon: Wallet
		},
		{
			to: "/profile",
			label: "Profile",
			icon: UserRound
		}
	];
}
function NavLink({ item, pathname }) {
	const Icon = item.icon;
	const active = isActive(pathname, item.to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.to,
		className: cn("flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
	});
}
function isActive(pathname, to) {
	if (to === "/home") return pathname === "/home" || pathname === "/scan";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function ShellSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-40 w-full rounded-[22px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-24 w-full rounded-[22px]" })
		]
	});
}
//#endregion
export { formatUsdExact as a, formatUsd as i, Skeleton as n, initials as o, formatRating as r, relativeTime as s, AppShell as t };
