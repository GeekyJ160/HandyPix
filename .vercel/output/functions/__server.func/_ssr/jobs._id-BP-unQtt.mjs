import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { b as TIME_WINDOW_LABEL, f as REVIEW_TAGS, l as DISPUTE_REASONS, o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { S as Check, c as Shield, f as MessageSquare, p as MapPin, s as Star, y as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient, r as Route$2 } from "./router-BJk2OPSE.mjs";
import { A as startJob, C as markJobComplete, D as requestChangeOrder, O as respondChangeOrder, T as openDispute, c as createBid, f as getJobDetail, i as cancelJob, p as getMyProfile, s as confirmJobComplete, w as markOnTheWay } from "./handypix-api-vStLCUsM.mjs";
import { a as formatUsdExact, i as formatUsd, n as Skeleton, o as initials, r as formatRating, s as relativeTime, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Badge } from "./badge-BIq6MIey.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { n as StatusBadge, r as UrgencyBadge } from "./status-Bd20Goar.mjs";
import { t as DiagnosisReport } from "./diagnosis-report-wjPDPyoU.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BKABWKbM.mjs";
import { t as fileToDataUrl } from "./image-BI0Yqbgc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs._id-BP-unQtt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JobTimeline({ job, payment }) {
	const steps = [
		{
			id: "accepted",
			label: "Bid accepted",
			done: Boolean(job.awardedBidId)
		},
		{
			id: "paid",
			label: "Payment authorized",
			done: Boolean(payment)
		},
		{
			id: "booked",
			label: "Appointment confirmed",
			done: Boolean(job.awardedAt) || job.status !== "open"
		},
		{
			id: "way",
			label: "On the way",
			done: Boolean(job.onTheWayAt)
		},
		{
			id: "start",
			label: "Job started",
			done: Boolean(job.startedAt)
		},
		{
			id: "done",
			label: "Job completed",
			done: job.status === "awaiting_confirm" || job.status === "complete"
		},
		{
			id: "released",
			label: "Payment released",
			done: payment?.status === "released" || job.status === "complete"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-0",
		children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("grid size-6 place-items-center rounded-full", step.done ? "bg-accent text-accent-fg" : "bg-surface-2 text-subtle"),
					children: step.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-subtle" })
				}), i < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("w-px flex-1 min-h-4", step.done ? "bg-accent/50" : "bg-border") }) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("pb-4 text-sm", step.done ? "text-fg" : "text-muted"),
				children: step.label
			})]
		}, step.id))
	});
}
function JobPage() {
	const { id } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobBody, { id }) });
}
function JobBody({ id }) {
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const detail = useQuery({
		queryKey: ["job", id],
		queryFn: () => getJobDetail({ data: id })
	});
	const [sort, setSort] = (0, import_react.useState)("price");
	if (detail.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full rounded-[24px]" });
	if (!detail.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Job not found."
	});
	const { job, bids, payment, isOwner, myBid, review, changeOrders, dispute } = detail.data;
	const role = profile.data?.role;
	const accepted = bids.find((b) => b.status === "accepted");
	const pendingChange = changeOrders.find((c) => c.status === "pending");
	const sorted = [...bids].sort((a, b) => {
		if (sort === "rating") return b.pro.ratingX10 - a.pro.ratingX10;
		if (sort === "distance") return a.distanceMiles - b.distanceMiles;
		if (sort === "warranty") return b.warrantyDays - a.warrantyDays;
		if (sort === "jobs") return b.pro.jobsCompleted - a.pro.jobsCompleted;
		return a.amountCents - b.amountCents;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: job.photoUrl,
			alt: "",
			className: "h-52 w-full rounded-[24px] object-cover sm:h-64"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: job.status }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyBadge, { value: job.urgency }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: CATEGORY_LABEL[job.category]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-3xl font-semibold tracking-tight",
			children: job.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 flex flex-wrap items-center gap-3 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
						job.zip,
						" · ",
						job.posterName
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: relativeTime(job.createdAt) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums",
					children: [
						formatUsd(job.budgetMinCents),
						"–",
						formatUsd(job.budgetMaxCents)
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-xs text-subtle",
			children: [
				job.preferredDate ? job.preferredDate : "Date flexible",
				" ·",
				" ",
				TIME_WINDOW_LABEL[job.timeWindow],
				" · Address hidden until hire"
			]
		}),
		job.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm leading-relaxed text-muted",
			children: job.description
		}) : null,
		job.isSeed && job.autoAward && role === "pro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 rounded-[16px] bg-accent-dim px-3 py-2 text-xs text-accent",
			children: "Demo listing — a qualified bid is auto-hired so you can walk the payout loop."
		}) : null,
		job.diagnosis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
			className: "mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "cursor-pointer text-sm font-semibold",
				children: "AI preliminary diagnosis"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosisReport, { result: job.diagnosis })
			})]
		}) : null,
		job.status !== "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Timeline"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobTimeline, {
						job,
						payment
					})
				}),
				accepted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						accepted.pro.displayName,
						" · ",
						formatUsd(accepted.amountCents)
					]
				}) : null,
				job.status !== "complete" && job.status !== "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/messages",
							search: { job: job.id },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), "Message"]
						})
					}), (isOwner || role === "pro" && myBid?.status === "accepted") && !job.startedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelButton, { jobId: job.id }) : null]
				}) : null
			]
		}) : null,
		payment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Payment hold"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					formatUsdExact(payment.amountCents),
					" ",
					payment.status,
					payment.status === "escrowed" ? " — released after you confirm the work" : "",
					" · ",
					"platform fee ",
					formatUsdExact(payment.feeCents)
				]
			})]
		}) : null,
		pendingChange && isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeOrderCard, {
			jobId: job.id,
			original: accepted?.amountCents ?? 0,
			reason: pendingChange.reason,
			extra: pendingChange.laborCents + pendingChange.materialsCents,
			id: pendingChange.id
		}) : null,
		changeOrders.filter((c) => c.status !== "pending").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-xs text-muted",
			children: [
				"Change order ",
				c.status,
				": ",
				formatUsd(c.laborCents + c.materialsCents),
				" — ",
				c.reason
			]
		}, c.id)),
		dispute ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 rounded-[16px] bg-warn/12 px-3 py-2 text-sm text-warn",
			children: [
				"Dispute open — ",
				dispute.reason,
				". Funds stay held while an admin reviews the photos, bid, and messages."
			]
		}) : null,
		isOwner && job.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Your bids"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "h-9 rounded-[10px] bg-surface-2 px-2 text-xs text-fg shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rating",
								children: "Rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "distance",
								children: "Distance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "jobs",
								children: "Completed jobs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "warranty",
								children: "Warranty"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: "Sorted lists are a view, not a recommendation. Pick the person you trust."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-3",
					children: sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Waiting on the first bid."
					}) : sorted.map((bid) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BidCard, {
						bid,
						hireable: true
					}, bid.id))
				})
			]
		}) : null,
		isOwner && accepted && job.status === "in_progress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Hired"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					accepted.pro.displayName,
					" is booked for ",
					formatUsd(accepted.amountCents),
					".",
					job.onTheWayAt && !job.startedAt ? " They have started traveling." : "",
					job.startedAt ? ` Job started ${new Date(job.startedAt).toLocaleTimeString()}.` : ""
				]
			})]
		}) : null,
		isOwner && job.status === "awaiting_confirm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmForm, {
			jobId: job.id,
			proName: accepted?.pro.displayName ?? "the pro",
			beforeUrl: job.photoUrl,
			afterUrl: job.afterPhotoUrl,
			work: job.workPerformed
		}) : null,
		isOwner && job.status === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-8 text-sm text-success",
			children: [
				"Job complete",
				review ? ` · ${review.rating}/5` : "",
				". Funds released."
			]
		}) : null,
		role === "pro" && !isOwner && job.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BidForm, {
			jobId: job.id,
			defaultAmount: myBid?.amountCents ?? job.budgetMinCents,
			existing: myBid
		}) : null,
		role === "pro" && myBid?.status === "accepted" && job.status === "in_progress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProJobActions, {
			jobId: job.id,
			onTheWay: Boolean(job.onTheWayAt),
			started: Boolean(job.startedAt)
		}) : null,
		role === "pro" && !isOwner && bids.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Other bids"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm text-muted",
				children: bids.filter((b) => b.proId !== profile.data?.userId).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b.pro.displayName }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatUsd(b.amountCents)
					})]
				}, b.id))
			})]
		}) : null
	] });
}
function BidCard({ bid, hireable }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 place-items-center rounded-full bg-surface-2 text-sm font-semibold",
				children: initials(bid.pro.displayName)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: bid.pro.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 flex items-center gap-1 text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-warn text-warn" }),
								formatRating(bid.pro.ratingX10),
								" · ",
								bid.pro.jobsCompleted,
								" jobs ·",
								" ",
								bid.distanceMiles.toFixed(1),
								" mi"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold tabular-nums",
							children: formatUsd(bid.amountCents)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: bid.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-2 text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), bid.availableWindow || `${bid.etaDays} day window`]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [bid.durationMinutes, " min"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [bid.warrantyDays, "-day warranty"] }),
							bid.materialsIncluded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "accent",
								children: "Materials in"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Labor only" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							"Labor ",
							formatUsd(bid.laborCents),
							" · Materials ",
							formatUsd(bid.materialsCents)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [hireable && bid.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "flex-1",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/hire/$bidId",
								params: { bidId: bid.id },
								children: "Accept bid"
							})
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pros/$id",
								params: { id: bid.proId },
								children: "View profile"
							})
						})]
					})
				]
			})]
		})
	});
}
function BidForm({ jobId, defaultAmount, existing }) {
	const [labor, setLabor] = (0, import_react.useState)(String(Math.round((existing?.laborCents ?? Math.round(defaultAmount * .78)) / 100)));
	const [materials, setMaterials] = (0, import_react.useState)(String(Math.round((existing?.materialsCents ?? Math.round(defaultAmount * .22)) / 100)));
	const [eta, setEta] = (0, import_react.useState)(String(existing?.etaDays ?? 2));
	const [message, setMessage] = (0, import_react.useState)(existing?.message ?? "");
	const [warranty, setWarranty] = (0, import_react.useState)(String(existing?.warrantyDays ?? 30));
	const [duration, setDuration] = (0, import_react.useState)(String(existing?.durationMinutes ?? 60));
	const [avail, setAvail] = (0, import_react.useState)(existing?.availableWindow ?? "Saturday 9:00–11:00 AM");
	const materialsIncluded = Number(materials) > 0;
	const total = (Number(labor) || 0) + (Number(materials) || 0);
	const mutate = useMutation({
		mutationFn: () => createBid({ data: {
			jobId,
			laborCents: Math.round(Number(labor) * 100),
			materialsCents: Math.round(Number(materials) * 100),
			amountCents: Math.round(total * 100),
			etaDays: Number(eta),
			message,
			materialsIncluded,
			warrantyDays: Number(warranty),
			durationMinutes: Number(duration),
			availableWindow: avail
		} }),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["job", jobId] });
			queryClient.invalidateQueries({ queryKey: ["bids"] });
			queryClient.invalidateQueries({ queryKey: ["market"] });
			if (res.autoAwarded) toast.success("Hired — funds are held");
			else toast.success("Bid sent");
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not bid")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-8 space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
		onSubmit: (e) => {
			e.preventDefault();
			mutate.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: existing ? "Update your bid" : "Submit bid"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "labor",
					children: "Labor (USD)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "labor",
					type: "number",
					min: 20,
					value: labor,
					onChange: (e) => setLabor(e.target.value),
					required: true
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "mats",
					children: "Materials (USD)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "mats",
					type: "number",
					min: 0,
					value: materials,
					onChange: (e) => setMaterials(e.target.value)
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: ["Total estimate ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-fg tabular-nums",
					children: formatUsd(total * 100)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "eta",
					children: "Days to start"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "eta",
					type: "number",
					min: 1,
					max: 30,
					value: eta,
					onChange: (e) => setEta(e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "dur",
					children: "Duration (min)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "dur",
					type: "number",
					min: 15,
					value: duration,
					onChange: (e) => setDuration(e.target.value)
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "win",
				children: "Available window"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "win",
				value: avail,
				onChange: (e) => setAvail(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "war",
				children: "Warranty (days)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "war",
				type: "number",
				min: 0,
				value: warranty,
				onChange: (e) => setWarranty(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "msg",
				children: "Note to homeowner"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "msg",
				value: message,
				onChange: (e) => setMessage(e.target.value),
				placeholder: "What you will do, and what is not included",
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: mutate.isPending,
				children: mutate.isPending ? "Sending…" : existing ? "Update bid" : "Submit bid"
			})
		]
	});
}
function ProJobActions({ jobId, onTheWay, started }) {
	const [work, setWork] = (0, import_react.useState)("");
	const [after, setAfter] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [extraLabor, setExtraLabor] = (0, import_react.useState)("90");
	const [extraMats, setExtraMats] = (0, import_react.useState)("50");
	const [showChange, setShowChange] = (0, import_react.useState)(false);
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["job", jobId] });
		queryClient.invalidateQueries({ queryKey: ["messages"] });
	};
	const way = useMutation({
		mutationFn: () => markOnTheWay({ data: { jobId } }),
		onSuccess: () => {
			invalidate();
			toast.success("Homeowner notified — you are on the way");
		}
	});
	const start = useMutation({
		mutationFn: () => startJob({ data: { jobId } }),
		onSuccess: () => {
			invalidate();
			toast.success("Job started");
		}
	});
	const complete = useMutation({
		mutationFn: () => markJobComplete({ data: {
			jobId,
			workPerformed: work,
			afterPhotoUrl: after
		} }),
		onSuccess: (res) => {
			invalidate();
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success(res.autoConfirmed ? "Complete — payout released" : "Submitted. Waiting on confirmation.");
		}
	});
	const change = useMutation({
		mutationFn: () => requestChangeOrder({ data: {
			jobId,
			reason,
			laborCents: Math.round(Number(extraLabor) * 100),
			materialsCents: Math.round(Number(extraMats) * 100)
		} }),
		onSuccess: () => {
			invalidate();
			toast.success("Change order sent");
			setShowChange(false);
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not request")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 space-y-3",
		children: [!onTheWay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "w-full",
			size: "lg",
			onClick: () => way.mutate(),
			disabled: way.isPending,
			children: "I'm on my way"
		}) : !started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "w-full",
			size: "lg",
			onClick: () => start.mutate(),
			disabled: start.isPending,
			children: "Start job"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
			onSubmit: (e) => {
				e.preventDefault();
				complete.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Submit completion"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "work",
					children: "Work performed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "work",
					value: work,
					onChange: (e) => setWork(e.target.value),
					placeholder: "Replaced worn drain gasket and tightened the connection.",
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "after",
						children: "After photo (optional)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "after",
						type: "file",
						accept: "image/*",
						className: "block w-full text-xs text-muted",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							setAfter(await fileToDataUrl(file));
						}
					}),
					after ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: after,
						alt: "",
						className: "mt-2 h-28 w-full rounded-[12px] object-cover"
					}) : null
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: complete.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), complete.isPending ? "Submitting…" : "Submit completion"]
				})
			]
		}), started ? showChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
			onSubmit: (e) => {
				e.preventDefault();
				change.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "New issue discovered"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: reason,
					onChange: (e) => setReason(e.target.value),
					placeholder: "Additional damaged pipe section found.",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Extra labor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: extraLabor,
						onChange: (e) => setExtraLabor(e.target.value),
						type: "number"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Extra materials" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: extraMats,
						onChange: (e) => setExtraMats(e.target.value),
						type: "number"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: change.isPending,
					children: "Request customer approval"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "w-full",
					onClick: () => setShowChange(false),
					children: "Cancel additional work"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			className: "w-full",
			onClick: () => setShowChange(true),
			children: "Request additional work"
		}) : null]
	});
}
function ChangeOrderCard({ id, jobId, original, extra, reason }) {
	const mutate = useMutation({
		mutationFn: (approve) => respondChangeOrder({ data: {
			changeOrderId: id,
			approve
		} }),
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error("Add funds to cover the extra work");
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["job", jobId] });
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success(res.approved ? "Change approved" : "Change declined");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-[20px] bg-warn/12 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Additional work requested"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: reason
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [
					"Original ",
					formatUsd(original),
					" · extra ",
					formatUsd(extra),
					" · new total",
					" ",
					formatUsd(original + extra)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => mutate.mutate(true),
					disabled: mutate.isPending,
					children: "Approve change"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => mutate.mutate(false),
					disabled: mutate.isPending,
					children: "Decline"
				})]
			})
		]
	});
}
function ConfirmForm({ jobId, proName, beforeUrl, afterUrl, work }) {
	const [rating, setRating] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)(["on_time", "quality"]);
	const [disputeOpen, setDisputeOpen] = (0, import_react.useState)(false);
	const [disputeReason, setDisputeReason] = (0, import_react.useState)(DISPUTE_REASONS[0].id);
	const [disputeDetails, setDisputeDetails] = (0, import_react.useState)("");
	const mutate = useMutation({
		mutationFn: () => confirmJobComplete({ data: {
			jobId,
			rating,
			comment,
			tags
		} }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job", jobId] });
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			toast.success("Confirmed — funds released");
		},
		onError: () => toast.error("Could not confirm")
	});
	const dispute = useMutation({
		mutationFn: () => openDispute({ data: {
			jobId,
			reason: disputeReason,
			details: disputeDetails
		} }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job", jobId] });
			toast.success("Dispute opened — funds stay held");
			setDisputeOpen(false);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Is the job complete?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: beforeUrl,
							alt: "Before",
							className: "h-28 w-full rounded-[12px] object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-1 text-xs text-subtle",
							children: "Before"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [afterUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: afterUrl,
							alt: "After",
							className: "h-28 w-full rounded-[12px] object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-28 place-items-center rounded-[12px] bg-surface-2 text-xs text-muted",
							children: "No after photo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-1 text-xs text-subtle",
							children: "After"
						})] })]
					}),
					work ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: work
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					mutate.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-lg font-semibold",
						children: [
							"How was ",
							proName,
							"?"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Looks good releases the hold to the pro, minus the 8% platform fee."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setRating(n),
							className: cn("p-1", n <= rating ? "text-warn" : "text-subtle"),
							"aria-label": `${n} stars`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-6", n <= rating && "fill-warn") })
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: REVIEW_TAGS.map((t) => {
							const on = tags.includes(t.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTags((prev) => on ? prev.filter((x) => x !== t.id) : [...prev, t.id]),
								className: cn("rounded-full px-3 py-1.5 text-xs font-medium", on ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
								children: t.label
							}, t.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: comment,
						onChange: (e) => setComment(e.target.value),
						placeholder: "Optional written review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: mutate.isPending,
						children: mutate.isPending ? "Releasing…" : "Looks good — complete job"
					})
				]
			}),
			disputeOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
				onSubmit: (e) => {
					e.preventDefault();
					dispute.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Report a problem"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: DISPUTE_REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDisputeReason(r.id),
							className: cn("rounded-full px-3 py-1.5 text-xs font-medium", disputeReason === r.id ? "bg-danger text-fg" : "bg-surface-2 text-muted"),
							children: r.label
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: disputeDetails,
						onChange: (e) => setDisputeDetails(e.target.value),
						placeholder: "What happened?",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "danger",
						className: "w-full",
						disabled: dispute.isPending,
						children: "Open dispute"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				className: "w-full",
				onClick: () => setDisputeOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), "Report a problem"]
			})
		]
	});
}
function CancelButton({ jobId }) {
	const mutate = useMutation({
		mutationFn: () => cancelJob({ data: { jobId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job", jobId] });
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			toast.success("Job cancelled");
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not cancel")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "sm",
		onClick: () => mutate.mutate(),
		disabled: mutate.isPending,
		children: "Cancel"
	});
}
//#endregion
export { JobPage as component };
