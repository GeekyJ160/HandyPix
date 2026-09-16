import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as URGENCY_LABEL, _ as SEVERITY_LABEL, v as STATUS_LABEL } from "./handypix-types-ysH_gE1n.mjs";
import { t as Badge } from "./badge-BIq6MIey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-Bd20Goar.js
var import_jsx_runtime = require_jsx_runtime();
function severityTone(severity) {
	if (severity === "emergency") return "danger";
	if (severity === "high") return "warn";
	if (severity === "medium") return "accent";
	return "neutral";
}
function SeverityBadge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: severityTone(value),
		children: SEVERITY_LABEL[value]
	});
}
function StatusBadge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: value === "complete" ? "success" : value === "in_progress" || value === "awaiting_confirm" ? "accent" : value === "cancelled" ? "danger" : "neutral",
		children: STATUS_LABEL[value]
	});
}
function UrgencyBadge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: value === "emergency" ? "danger" : "neutral",
		children: URGENCY_LABEL[value]
	});
}
//#endregion
export { StatusBadge as n, UrgencyBadge as r, SeverityBadge as t };
