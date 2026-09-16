import { x as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { d as HOME_CATEGORIES } from "./handypix-types-ysH_gE1n.mjs";
import { C as Camera, g as ImagePlus, i as Video, x as ChevronRight } from "../_libs/lucide-react.mjs";
import { b as listMyDiagnoses, p as getMyProfile, x as listMyJobs } from "./handypix-api-vStLCUsM.mjs";
import { i as formatUsd, n as Skeleton, s as relativeTime, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as SeverityBadge } from "./status-Bd20Goar.mjs";
import { t as JobCard } from "./job-card-DzPANCt_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-DXFYbAZz.js
var import_jsx_runtime = require_jsx_runtime();
function greeting() {
	const h = (/* @__PURE__ */ new Date()).getHours();
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeBody, {}) });
}
function HomeBody() {
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const jobs = useQuery({
		queryKey: ["jobs"],
		queryFn: () => listMyJobs()
	});
	const diagnoses = useQuery({
		queryKey: ["diagnoses"],
		queryFn: () => listMyDiagnoses()
	});
	if (profile.data?.role === "pro") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/market" });
	const openJobs = (jobs.data ?? []).filter((j) => j.status !== "complete" && j.status !== "cancelled");
	const first = profile.data?.displayName.split(" ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: profile.data ? `${greeting()}, ${first}` : greeting()
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl font-semibold tracking-tight",
			children: "What's wrong?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Take a picture and let HandyPix AI help."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/scan",
			className: "mt-6 flex items-center gap-4 rounded-[24px] bg-accent px-5 py-5 text-accent-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-12 place-items-center rounded-full bg-accent-fg/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-lg font-semibold",
						children: "Take a photo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm opacity-80",
						children: "Close-up plus a wider shot works best"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 opacity-70" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/scan",
					search: { mode: "upload" },
					className: "flex min-h-12 items-center justify-center gap-2 rounded-[16px] bg-surface text-sm shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), "Upload"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/scan",
					search: { mode: "video" },
					className: "flex min-h-12 items-center justify-center gap-2 rounded-[16px] bg-surface text-sm shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), "Video"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/jobs",
					className: "flex min-h-12 items-center justify-center rounded-[16px] bg-surface text-sm shadow-[var(--shadow-border)]",
					children: "My jobs"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Trades"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: HOME_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/scan",
					search: { category: c.id },
					className: "rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-fg",
					children: c.label
				}, c.label))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Active jobs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/jobs",
					className: "text-sm text-muted hover:text-fg",
					children: "All"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-3",
				children: jobs.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-[22px]" }) : openJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]",
					children: "No open jobs yet. Snap a problem to post one."
				}) : openJobs.slice(0, 3).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
					job,
					href: "/jobs/$id"
				}, job.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Recent diagnoses"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-2",
				children: diagnoses.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }) : (diagnoses.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nothing scanned yet."
				}) : diagnoses.data.slice(0, 4).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/diagnosis/$id",
					params: { id: d.id },
					className: "flex items-center gap-3 rounded-[18px] bg-surface p-2 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: d.photoUrl,
							alt: "",
							className: "size-14 rounded-[12px] object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: d.result.issue
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									formatUsd(d.result.est_cost_min_cents),
									"–",
									formatUsd(d.result.est_cost_max_cents),
									" ",
									"· ",
									relativeTime(d.createdAt)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { value: d.result.severity })
					]
				}, d.id))
			})]
		})
	] });
}
//#endregion
export { HomePage as component };
