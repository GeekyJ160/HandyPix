import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { i as CATEGORIES, o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient } from "./router-BJk2OPSE.mjs";
import { j as updateProfile, p as getMyProfile } from "./handypix-api-vStLCUsM.mjs";
import { n as Skeleton, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BKABWKbM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-C1FPNfYU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileBody, {}) });
}
function ProfileBody() {
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [zip, setZip] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("homeowner");
	const [trades, setTrades] = (0, import_react.useState)([]);
	const [hourly, setHourly] = (0, import_react.useState)("85");
	(0, import_react.useEffect)(() => {
		if (!profile.data) return;
		setDisplayName(profile.data.displayName);
		setCity(profile.data.city);
		setZip(profile.data.zip);
		setBio(profile.data.bio);
		setRole(profile.data.role);
		setTrades(profile.data.trades);
		setHourly(String(Math.round(profile.data.hourlyRateCents / 100) || 85));
	}, [profile.data]);
	const save = useMutation({
		mutationFn: () => updateProfile({ data: {
			displayName,
			city,
			zip,
			bio,
			role,
			trades,
			hourlyRateCents: Math.round(Number(hourly) * 100)
		} }),
		onSuccess: (p) => {
			queryClient.setQueryData(["profile"], p);
			toast.success("Profile saved");
		},
		onError: () => toast.error("Could not save")
	});
	if (profile.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-[24px]" });
	if (!profile.data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: "Profile"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 space-y-4",
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: ["homeowner", "pro"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRole(r),
						className: cn("rounded-[16px] px-3 py-3 text-sm font-medium shadow-[var(--shadow-border)]", role === r ? "bg-accent text-accent-fg" : "bg-surface text-muted"),
						children: r === "homeowner" ? "Homeowner" : "Pro"
					}, r))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "n",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "n",
					value: displayName,
					onChange: (e) => setDisplayName(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "c",
						children: "City"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "c",
						value: city,
						onChange: (e) => setCity(e.target.value)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "z",
						children: "ZIP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "z",
						value: zip,
						onChange: (e) => setZip(e.target.value)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "b",
					children: "Bio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "b",
					value: bio,
					onChange: (e) => setBio(e.target.value)
				})] }),
				role === "pro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Trades" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "h",
					children: "Hourly rate (USD)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "h",
					type: "number",
					min: 20,
					value: hourly,
					onChange: (e) => setHourly(e.target.value)
				})] })] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save profile"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/wallet",
				className: "text-sm text-muted hover:text-fg",
				children: role === "pro" ? "Earnings" : "Wallet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/blueprint",
				className: "text-sm text-muted hover:text-fg",
				children: "Product blueprint"
			})]
		})
	] });
}
//#endregion
export { ProfilePage as component };
