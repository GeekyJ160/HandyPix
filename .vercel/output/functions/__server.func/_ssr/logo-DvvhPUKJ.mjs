import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-DvvhPUKJ.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-accent", className),
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "10.6",
				fill: "var(--color-surface)",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 6.8 20.1 13.5 16 16 11.9 13.5Z",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M25.2 16 18.5 20.1 16 16 18.5 11.9Z",
				fill: "currentColor",
				opacity: ".82"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 25.2 11.9 18.5 16 16 20.1 18.5Z",
				fill: "currentColor",
				opacity: ".52"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6.8 16 13.5 11.9 16 16 13.5 20.1Z",
				fill: "currentColor",
				opacity: ".82"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "3",
				fill: "var(--color-bg)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "2",
				y: "9.5",
				width: "4.4",
				height: "2.1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "25.6",
				y: "20.4",
				width: "4.4",
				height: "2.1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "9.5",
				y: "2",
				width: "2.1",
				height: "4.4",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20.4",
				y: "25.6",
				width: "2.1",
				height: "4.4",
				fill: "currentColor"
			})
		]
	});
}
function Logo({ className, markClassName, wordmark = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: cn("size-8", markClassName) }), wordmark ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-[1.05rem] font-semibold tracking-tight text-fg",
			children: ["HandyPix ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				children: "AI"
			})]
		}) : null]
	});
}
//#endregion
export { cn as n, Logo as t };
