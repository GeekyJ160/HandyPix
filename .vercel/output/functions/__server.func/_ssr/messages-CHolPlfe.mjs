import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./logo-DvvhPUKJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as queryClient, s as Route$10 } from "./router-BJk2OPSE.mjs";
import { S as listThreads, k as sendMessage, v as listMessages } from "./handypix-api-vStLCUsM.mjs";
import { n as Skeleton, s as relativeTime, t as AppShell } from "./app-shell-B1Ywie2_.mjs";
import { t as Button } from "./button-AQha3EO_.mjs";
import { t as Input } from "./input-BKABWKbM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-CHolPlfe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MessagesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesBody, {}) });
}
function MessagesBody() {
	const { job: jobFromSearch } = Route$10.useSearch();
	const threads = useQuery({
		queryKey: ["messages"],
		queryFn: () => listThreads()
	});
	const [active, setActive] = (0, import_react.useState)(jobFromSearch);
	const current = active ?? jobFromSearch ?? threads.data?.[0]?.jobId;
	if (threads.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-[24px]" });
	if (!threads.data?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl font-semibold tracking-tight",
		children: "Messages"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]",
		children: "Threads open after you hire a pro. Phone numbers stay hidden."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl font-semibold tracking-tight",
		children: "Messages"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid gap-4 md:grid-cols-[220px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: threads.data.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setActive(t.jobId),
				className: cn("w-full rounded-[16px] p-3 text-left shadow-[var(--shadow-border)]", current === t.jobId ? "bg-surface-2" : "bg-surface"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: t.otherName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs text-subtle",
						children: t.lastBody
					})
				]
			}) }, t.jobId))
		}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thread, { jobId: current }) : null]
	})] });
}
function Thread({ jobId }) {
	const messages = useQuery({
		queryKey: ["thread", jobId],
		queryFn: () => listMessages({ data: jobId })
	});
	const [body, setBody] = (0, import_react.useState)("");
	const send = useMutation({
		mutationFn: () => sendMessage({ data: {
			jobId,
			body
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["thread", jobId] });
			queryClient.invalidateQueries({ queryKey: ["messages"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "In-app thread"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/jobs/$id",
					params: { id: jobId },
					className: "text-xs text-accent",
					children: "Open job"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 space-y-3 overflow-y-auto",
				children: messages.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }) : (messages.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No messages yet."
				}) : messages.data.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("max-w-[85%]", m.mine && "ml-auto"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-subtle",
						children: [
							m.fromName,
							" · ",
							relativeTime(m.createdAt)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 rounded-[14px] px-3 py-2 text-sm", m.mine ? "bg-accent text-accent-fg" : "bg-surface-2"),
						children: m.body
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					if (body.trim()) send.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Message — numbers stay masked"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: send.isPending,
					children: "Send"
				})]
			})
		]
	});
}
//#endregion
export { MessagesPage as component };
