import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BIq6MIey.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", tone === "neutral" && "bg-surface-2 text-muted", tone === "accent" && "bg-accent-dim text-accent", tone === "success" && "bg-success/15 text-success", tone === "warn" && "bg-warn/15 text-warn", tone === "danger" && "bg-danger/15 text-danger", className),
		...props
	});
}
//#endregion
export { Badge as t };
