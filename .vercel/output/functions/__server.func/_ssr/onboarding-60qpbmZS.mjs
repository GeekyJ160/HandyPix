import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { i as CATEGORIES, o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn, t as Logo } from "./logo-DvvhPUKJ.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
import { C as Camera, n as Wrench } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient } from "./router-BJk2OPSE.mjs";
import { a as completeOnboarding, p as getMyProfile, t as RedirectToSignIn } from "./handypix-api-vStLCUsM.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { n as Label, t as Input } from "./input-BKABWKbM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-60qpbmZS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const sessionUser = useCurrentUser();
	const navigate = useNavigate();
	const existing = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const [role, setRole] = (0, import_react.useState)("homeowner");
	const [displayName, setDisplayName] = (0, import_react.useState)(sessionUser?.displayName ?? "");
	const [city, setCity] = (0, import_react.useState)("Dallas");
	const [zip, setZip] = (0, import_react.useState)("75201");
	const [trades, setTrades] = (0, import_react.useState)(["plumbing"]);
	const mutate = useMutation({
		mutationFn: () => completeOnboarding({ data: {
			role,
			displayName,
			city,
			zip,
			trades
		} }),
		onSuccess: (profile) => {
			queryClient.setQueryData(["profile"], profile);
			toast.success(role === "pro" ? "Pro profile ready" : "You are set to hire");
			navigate({ to: role === "pro" ? "/market" : "/home" });
		},
		onError: () => toast.error("Could not finish setup")
	});
	if (isPending || existing.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-bg" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (existing.data) {
		navigate({ to: existing.data.role === "pro" ? "/market" : "/home" });
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-lg px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-display text-3xl font-semibold tracking-tight",
				children: "How will you use HandyPix?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "You can switch later in profile."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
					active: role === "homeowner",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5" }),
					title: "I need it fixed",
					copy: "Snap a problem, get a diagnosis, hire a pro.",
					onClick: () => setRole("homeowner")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
					active: role === "pro",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" }),
					title: "I am a pro",
					copy: "Browse jobs near you and bid with a firm price.",
					onClick: () => setRole("pro")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					mutate.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						value: displayName,
						onChange: (e) => setDisplayName(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "city",
							children: "City"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "city",
							value: city,
							onChange: (e) => setCity(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "zip",
							children: "ZIP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "zip",
							value: zip,
							onChange: (e) => setZip(e.target.value)
						})] })]
					}),
					role === "pro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Trades" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: CATEGORIES.map((c) => {
							const on = trades.includes(c);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTrades((prev) => on ? prev.filter((x) => x !== c) : [...prev, c]),
								className: cn("rounded-full px-3 py-1.5 text-xs font-medium", on ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
								children: CATEGORY_LABEL[c]
							}, c);
						})
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: mutate.isPending,
						children: mutate.isPending ? "Saving…" : "Continue"
					})
				]
			})
		]
	});
}
function RoleCard({ active, icon, title, copy, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("rounded-[22px] bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-shadow", active && "shadow-[0_0_0_1px_var(--color-accent)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 place-items-center rounded-[12px] bg-surface-2 text-accent",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-muted",
				children: copy
			})
		]
	});
}
//#endregion
export { Onboarding as component };
