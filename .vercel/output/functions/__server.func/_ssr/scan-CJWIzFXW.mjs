import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { h as SAMPLE_SCANS, o as CATEGORY_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { C as Camera, d as Plus, g as ImagePlus, i as Video, m as LoaderCircle, t as X, u as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient, o as Route$7 } from "./router-BJk2OPSE.mjs";
import { l as diagnosePhoto } from "./handypix-api-vStLCUsM.mjs";
import { t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { n as Label, r as Textarea } from "./input-BKABWKbM.mjs";
import { n as urlToDataUrl, t as fileToDataUrl } from "./image-BI0Yqbgc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-CJWIzFXW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"Reading the photo",
	"Identifying the failure",
	"Estimating parts and labor"
];
function ScanPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBody, {}) });
}
function ScanBody() {
	const navigate = useNavigate();
	const search = Route$7.useSearch();
	const cameraRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const [photos, setPhotos] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [stage, setStage] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (search.mode === "upload") fileRef.current?.click();
		if (search.mode === "camera" || search.mode === "video") cameraRef.current?.click();
	}, [search.mode]);
	const mutate = useMutation({
		mutationFn: async () => {
			const timer = window.setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 1400);
			try {
				const hint = search.category ? `Likely trade: ${CATEGORY_LABEL[search.category]}. ${notes}` : notes;
				return await diagnosePhoto({ data: {
					imageDataUrl: photos[0],
					extraPhotos: photos.slice(1),
					notes: hint
				} });
			} finally {
				window.clearInterval(timer);
			}
		},
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error(res.error);
				setStage(0);
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
			navigate({
				to: "/diagnosis/$id",
				params: { id: res.diagnosis.id }
			});
		},
		onError: () => {
			toast.error("Diagnosis failed. Try another photo.");
			setStage(0);
		}
	});
	async function handleFile(file) {
		if (!file) return;
		if (file.type.startsWith("video/")) {
			toast.message("Still frames diagnose better — grab a photo of the problem.");
			return;
		}
		try {
			const url = await fileToDataUrl(file);
			setPhotos((prev) => [...prev, url].slice(0, 4));
		} catch {
			toast.error("Could not read that photo");
		}
	}
	async function handleSample(src) {
		try {
			const url = await urlToDataUrl(src);
			setPhotos([url]);
		} catch {
			toast.error("Could not load sample");
		}
	}
	const preview = photos[0] ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold tracking-tight",
			children: "Show us the problem"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Tip: take a close-up and a wider photo of where it sits."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: cameraRef,
			type: "file",
			accept: "image/*",
			capture: "environment",
			className: "hidden",
			onChange: (e) => void handleFile(e.target.files?.[0])
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: fileRef,
			type: "file",
			accept: "image/*",
			className: "hidden",
			onChange: (e) => void handleFile(e.target.files?.[0])
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => cameraRef.current?.click(),
			className: cn("mt-6 flex w-full flex-col items-center justify-center overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]", preview ? "p-2" : "min-h-56 p-8"),
			children: preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: preview,
				alt: "Selected problem",
				className: "max-h-80 w-full rounded-[20px] object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-14 place-items-center rounded-full bg-accent-dim text-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-3 font-display font-semibold",
					children: "Take photo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 text-sm text-muted",
					children: "or upload from the library"
				})
			] })
		}),
		photos.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-2",
			children: photos.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setPhotos((prev) => prev.filter((_, idx) => idx !== i)),
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: "size-16 rounded-[12px] object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
				})]
			}, src.slice(0, 24) + i))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid grid-cols-2 gap-2",
			children: preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => {
					setPhotos([]);
					cameraRef.current?.click();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Retake"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				disabled: photos.length >= 4,
				onClick: () => cameraRef.current?.click(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add photo"]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => cameraRef.current?.click(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "Camera"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => fileRef.current?.click(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), "Upload"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "ghost",
			className: "mt-1 w-full",
			onClick: () => cameraRef.current?.click(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), "Add video still"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "notes",
				children: "What are you seeing? (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "notes",
				rows: 3,
				value: notes,
				onChange: (e) => setNotes(e.target.value),
				placeholder: "Drips when the handle is off. Started last week."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4 w-full",
			size: "lg",
			disabled: !preview || mutate.isPending,
			onClick: () => preview && mutate.mutate(),
			children: mutate.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), STAGES[stage]] }) : "Diagnose with AI"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Try a sample"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: "No camera needed — these still run a real diagnosis."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: SAMPLE_SCANS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void handleSample(s.src),
						className: "overflow-hidden rounded-[16px] bg-surface text-left shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.src,
							alt: s.label,
							className: "aspect-[4/3] w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block px-2 py-2 text-xs",
							children: s.label
						})]
					}, s.id))
				})
			]
		})
	] });
}
//#endregion
export { ScanPage as component };
