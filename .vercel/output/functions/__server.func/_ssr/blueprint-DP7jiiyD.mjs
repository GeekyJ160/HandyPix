import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Logo } from "./logo-DvvhPUKJ.mjs";
import { D as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blueprint-DP7jiiyD.js
var import_jsx_runtime = require_jsx_runtime();
function BlueprintPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-3xl items-center justify-between px-5 py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Home"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-3xl px-5 pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.18em] text-accent",
					children: "Product blueprint"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl font-semibold tracking-tight",
					children: "HandyPix AI"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-accent",
					children: "Snap it. Diagnose it. Fix it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base leading-relaxed text-muted",
					children: "Take a picture of what's wrong. HandyPix AI helps identify the likely issue, gets bids from vetted local professionals, lets you compare them, and handles the job and payment in one place."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "AI is a preliminary visual assessment — never a guaranteed inspection. Electrical, gas, structural, roofing, plumbing, and HVAC issues recommend a licensed pro. Dangerous situations surface emergency guidance instead of a bid."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Customer journey",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-1.5 text-sm text-muted",
						children: [
							"Open app → take photo or video still",
							"AI analyzes the problem and asks one clarifying question",
							"Homeowner confirms (Looks right) or retakes (Something else)",
							"Safety gate: routine / inspection recommended / dangerous",
							"AI drafts the job. Homeowner edits, picks date, window, budget",
							"Matching local pros are notified and submit bids",
							"Homeowner compares (price, rating, distance, warranty, jobs)",
							"Accept bid → authorize payment hold → appointment confirmed",
							"Pro: on the way → start job → optional change order",
							"Pro submits completion with work notes and after photos",
							"Homeowner confirms or opens a dispute",
							"Funds release to the pro minus platform fee → review"
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Screens and primary buttons",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { rows: [
						[
							"Welcome",
							"/",
							"Get started, Log in. Tagline and sample jobs."
						],
						[
							"Sign in",
							"/login",
							"Continue with Google or X"
						],
						[
							"Onboarding",
							"/onboarding",
							"Homeowner vs Pro, name, city, ZIP, trades"
						],
						[
							"Home",
							"/home",
							"Take a photo, Upload, Video, My jobs, trade chips, active jobs"
						],
						[
							"Capture",
							"/scan",
							"Take photo, Retake, Use photo, Add photo, Add video still, Diagnose"
						],
						[
							"Diagnosis",
							"/diagnosis/:id",
							"Looks right, Something else, follow-up chips, Call 911 on danger"
						],
						[
							"Post job",
							"on diagnosis",
							"Edit description, date, window, budget → Get local bids"
						],
						[
							"Job / bids",
							"/jobs/:id",
							"Sort bids, Accept bid, View profile, Message, Cancel"
						],
						[
							"Pro profile",
							"/pros/:id",
							"Verification, skills, reviews, portfolio"
						],
						[
							"Checkout",
							"/hire/:bidId",
							"Terms checkbox, Pay & book. Demo Visa on wallet."
						],
						[
							"Tracking",
							"/jobs/:id",
							"I'm on my way, Start job, Submit completion, Request additional work"
						],
						[
							"Confirm",
							"/jobs/:id",
							"Looks good — complete job, Report a problem, star + tags"
						],
						[
							"Messages",
							"/messages",
							"In-app thread. Numbers stay masked."
						],
						[
							"Wallet / Earnings",
							"/wallet",
							"Hold, release, refund, Add $500 demo funds"
						],
						[
							"Market (pro)",
							"/market",
							"Open jobs by trade, Submit bid or Pass"
						],
						[
							"Bids (pro)",
							"/bids",
							"Pending, hired, closed"
						],
						[
							"Profile",
							"/profile",
							"Switch Homeowner / Pro"
						]
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Navigation",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Homeowner tabs: Home · Jobs · Messages · Wallet · Profile. Capture lives on Home, not as a fifth duplicate tab. Pro tabs: Jobs · Bids · Messages · Earnings · Profile."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Database",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Postgres (Neon in production, local fallback in preview). Auth users own every personal row via user_id. Seed listings use seed: ids so one signed-in visitor can still walk the marketplace."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { rows: [
						["profiles", "role, name, city, ZIP, trades, rates, wallet, ratings"],
						["diagnoses", "photo(s), structured Grok result (observations, safety_level, follow-up), job_id"],
						["jobs", "category, diagnosis JSON, status, ZIP, budget band, preferred date, time window, timeline timestamps, work notes, after photo"],
						["bids", "labor, materials, total, ETA, warranty, duration, window, distance, pending/accepted/declined"],
						["payments", "authorized hold → released or refunded, amount, 8% fee"],
						["wallet_events", "credits, holds, releases, refunds"],
						["reviews", "rating, comment, tags after confirm"],
						["messages", "job thread, from_id, body"],
						["change_orders", "reason, extra labor/materials, pending/approved/declined"],
						["disputes", "reason, details, open/resolved — funds stay held"],
						["seed_pros", "eight DFW tradespeople with verification and reviews"]
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "AI diagnosis flow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "space-y-3 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "1. Capture."
							}), " Camera, library, or a second angle. Client resizes to 960px JPEG. Originals stay on the job record."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "2. Diagnose."
							}), " Signed-in server call to grok-4.5 with the photo. JSON: issue, trade, severity, safety_level (normal / caution / danger), complexity, observations, follow-up question, DIY, parts, Dallas cost range, confidence."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "3. Confirm."
							}), " Homeowner answers the follow-up, then Looks right or Something else. The answer is written into the job description."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "4. Safety gate."
							}), " Danger blocks bidding and shows emergency guidance. Caution still posts, with a professional-inspection warning. Routine continues."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "5. Draft."
							}), " AI writes a real job description instead of “sink leaking idk.” Homeowner can edit before Get local bids."] })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Matching and bidding",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Matching uses distance, category, skills, availability, verification, completed jobs, rating, and response history. The UI never shows an opaque “AI score.” Customers see miles, stars, jobs, trades, and a window."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "space-y-3 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Notify."
							}), " Seeded Dallas pros in the matching trade bid instantly so the loop is playable with one account. Real pros can also bid."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Submit."
							}), " Labor, materials, total, available window, duration, warranty days, and a note. Pass leaves the listing."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Compare."
							}), " Sort by price, rating, distance, completed jobs, or warranty. Cheapest is not auto-selected."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Award."
							}), " One bid accepted; the rest decline. Demo market jobs with auto-hire accept a real pro bid so payout can be walked."] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Payment, change orders, disputes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "space-y-3 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Authorize."
							}), " Bid amount leaves the homeowner wallet and is marked held. Production should use Stripe Connect (or similar) — this preview is a ledger, not a licensed escrow product."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Change order."
							}), " If the job is larger than quoted, the pro requests extra labor and materials. The homeowner approves (additional hold) or declines. No silent re-price."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Release."
							}), " Homeowner confirms and rates. Net (bid − 8% fee, plus approved extras) credits the pro. Seed payers skip the wallet debit."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "Dispute."
							}), " Not completed, differs, damage, unexpected price, no-show, or other. Collects photos, bid, messages, completion notes. Funds stay held for admin review."] })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Development plan",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phase, {
								n: "v1 — this app",
								items: [
									"Auth (Google / X), homeowner and pro roles",
									"Vision diagnosis with grok-4.5, safety levels, follow-up",
									"Job post, bid compare, hire, payment hold, timeline, review",
									"Change orders, disputes, in-app messages",
									"Dallas seed market so one user can play both sides"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phase, {
								n: "v2 — real money and trust",
								items: [
									"Stripe Connect for cards and pro payouts",
									"ID, license, insurance, and background verification (only then show badges)",
									"Masked voice/SMS, calendar arrival windows, GPS start-job check",
									"Admin dispute console"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phase, {
								n: "v3 — density",
								items: [
									"Live map of nearby open jobs",
									"Materials marketplace from the parts list",
									"Recurring maintenance plans",
									"Video diagnosis and multi-trade jobs"
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-10 w-full",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Start in the app"
					})
				})
			]
		})]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-semibold tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children
		})]
	});
}
function Table({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-[20px] bg-surface shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: "w-full text-left text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border first:border-t-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "w-[34%] px-3 py-2.5 align-top font-medium",
					children: row[0]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-2.5 text-muted",
					children: row.slice(1).join(" — ")
				})]
			}, row[0] + row[1])) })
		})
	});
}
function Phase({ n, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-semibold",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-1 text-sm text-muted",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
		})]
	});
}
//#endregion
export { BlueprintPage as component };
