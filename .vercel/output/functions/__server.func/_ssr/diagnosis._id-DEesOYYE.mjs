import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { C as URGENCY_LABEL, S as URGENCIES, b as TIME_WINDOW_LABEL, n as BUDGET_BAND_LABEL, t as BUDGET_BANDS, y as TIME_WINDOWS } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$5, c as queryClient } from "./router-BJk2OPSE.mjs";
import { E as postJobFromDiagnosis, d as getDiagnosis, o as confirmDiagnosis, p as getMyProfile } from "./handypix-api-vStLCUsM.mjs";
import { n as Skeleton, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { t as DiagnosisReport } from "./diagnosis-report-wjPDPyoU.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BKABWKbM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnosis._id-DEesOYYE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DiagnosisPage() {
	const { id } = Route$5.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosisBody, { id }) });
}
function DiagnosisBody({ id }) {
	const navigate = useNavigate();
	const dx = useQuery({
		queryKey: ["diagnosis", id],
		queryFn: () => getDiagnosis({ data: id })
	});
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const [step, setStep] = (0, import_react.useState)("report");
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [zip, setZip] = (0, import_react.useState)("");
	const [urgency, setUrgency] = (0, import_react.useState)("soon");
	const [timeWindow, setTimeWindow] = (0, import_react.useState)("flexible");
	const [budgetBand, setBudgetBand] = (0, import_react.useState)("unknown");
	const [preferredDate, setPreferredDate] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 3);
		return d.toISOString().slice(0, 10);
	});
	(0, import_react.useEffect)(() => {
		const result = dx.data?.result;
		if (!result) return;
		setTitle((t) => t || result.issue);
		setDescription((d) => {
			if (d) return d;
			const extra = result.follow_up_answer ? `\n\nHomeowner: ${result.follow_up_question} ${result.follow_up_answer}.` : "";
			return `${result.summary}${extra}`;
		});
		setAnswer((a) => a || result.follow_up_answer);
	}, [dx.data]);
	const saveAnswer = useMutation({
		mutationFn: () => confirmDiagnosis({ data: {
			diagnosisId: id,
			answer
		} }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["diagnosis", id] });
		}
	});
	const post = useMutation({
		mutationFn: () => postJobFromDiagnosis({ data: {
			diagnosisId: id,
			zip: zip || profile.data?.zip || "75201",
			urgency,
			title,
			description,
			preferredDate,
			timeWindow,
			budgetBand
		} }),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["jobs"] });
			queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
			toast.success("Job posted — local pros are bidding");
			navigate({
				to: "/jobs/$id",
				params: { id: res.jobId }
			});
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not post this job")
	});
	if (dx.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-[24px]" });
	if (!dx.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Diagnosis not found."
	});
	const row = dx.data;
	const danger = row.result.safety_level === "danger";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 overflow-x-auto",
			children: row.photoUrls.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: "",
				className: "h-52 w-full min-w-[70%] rounded-[24px] object-cover sm:h-64"
			}, `${row.id}-${i}`))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagnosisReport, { result: row.result })
		}),
		row.jobId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-8 w-full",
			size: "lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/jobs/$id",
				params: { id: row.jobId },
				children: "View posted job"
			})
		}) : step === "report" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 space-y-4",
			children: [row.result.follow_up_question ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: row.result.follow_up_question
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: row.result.follow_up_options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setAnswer(opt);
							confirmDiagnosis({ data: {
								diagnosisId: id,
								answer: opt
							} });
						},
						className: cn("rounded-full px-3 py-1.5 text-xs font-medium", answer === opt ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
						children: opt
					}, opt))
				})]
			}) : null, danger ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Bidding is paused on dangerous issues. Get a professional on site — or emergency services — before using HandyPix as a marketplace."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					onClick: () => {
						if (answer) saveAnswer.mutate();
						setStep("post");
					},
					children: "Looks right"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "lg",
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/scan",
						children: "Something else"
					})
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-8 space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
			onSubmit: (e) => {
				e.preventDefault();
				post.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Let's get this posted"
				}),
				row.result.safety_level === "caution" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-warn",
					children: "A professional should inspect this before repair. Bids are for that inspection and the work that follows."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "title",
					children: "Problem"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "title",
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "desc",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "desc",
					rows: 5,
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "zip",
					children: "ZIP — address stays hidden until you hire"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "zip",
					value: zip || profile.data?.zip || "",
					onChange: (e) => setZip(e.target.value),
					placeholder: "75201"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "date",
					children: "Preferred date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "date",
					type: "date",
					value: preferredDate,
					onChange: (e) => setPreferredDate(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Time of day" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: TIME_WINDOWS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTimeWindow(w),
						className: cn("rounded-full px-3 py-1.5 text-xs font-medium", timeWindow === w ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
						children: TIME_WINDOW_LABEL[w]
					}, w))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "When do you need it?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: URGENCIES.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setUrgency(u),
						className: cn("rounded-full px-3 py-1.5 text-xs font-medium", urgency === u ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
						children: URGENCY_LABEL[u]
					}, u))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Budget (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: BUDGET_BANDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setBudgetBand(b),
						className: cn("rounded-full px-3 py-1.5 text-xs font-medium", budgetBand === b ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
						children: BUDGET_BAND_LABEL[b]
					}, b))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: post.isPending,
					children: post.isPending ? "Posting…" : "Get local bids"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "w-full",
					onClick: () => setStep("report"),
					children: "Back"
				})
			]
		})
	] });
}
//#endregion
export { DiagnosisPage as component };
