import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
import { a as hasGateSessionMarker } from "./server-kCE-vfcO.mjs";
import { t as authMiddleware } from "./middleware-Ct9xyLPo.mjs";
import { l as createSsrRpc } from "./router-BJk2OPSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handypix-api-vStLCUsM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("21be64e2d77b8f8def8e5ab4c6222094bb65b6da7afc3966d642697263b5a7eb"));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f462a15177cb8874c3d8079e1fed934dbb55fbadb2b07a140ea26721bbd61b6e"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0730242d1591d14014af713612dac0c9829121be18669c6897849cb154d85a48"));
var diagnosePhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c0a2b066bad114c658c6487a675bea885abcb6e8df558fd0da52602e602c1cb7"));
var listMyDiagnoses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bd1c3f65a10bc6c063b108f1fa94f3b2f1d5af20ffa9f07cbf04f6a745df7bb8"));
var getDiagnosis = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("b7017df3ca3638b865585f6aed68e21f30691c68bd0113ab0679367dd817a0aa"));
var confirmDiagnosis = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3234a8eee3c6f157fc043ca26cabfd03a3dd549f260c93d4c876f94e4c4d139b"));
var postJobFromDiagnosis = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bdca178b0d176afbb2deb71bc7d2b2483484686ea1e88a26c3c4129680abf25b"));
var listMyJobs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f95e836f1490585a7573264f9a23d303944862cb8140ac310256009d35187bdf"));
var listMarketJobs = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("84eb69419c44c56664184e968f6250c1e33a2aa28f3e820810f963f24de86fff"));
var getJobDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("095c5daa1c37c8174437e9ac34a7b5e762560ceaa2c015ea9ca534717b575935"));
var hireBid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2bd6250c59f7ba8c6f27a43d73c624d5faff73c011d4f084055bc8d1999f22c4"));
var createBid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a135b3779e7da39bdc93f71e55c38630a1900c8c3a7f8d20b1db6f87bab527f4"));
var listMyBids = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("143c75703b560ae93435687cf9bf36741a9ccff4cf5d5991f8629836c3f8dadd"));
var markOnTheWay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fbd4cda6983df547e0650647dce8c5155d1d3b926417d12b5dc4a698f747710a"));
var startJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d1a6a6999e189c4eb24c0951ca9967ceeb4529376aa8a9e00972a2513ec9731e"));
var markJobComplete = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("746fb1d69c1344b1d5625806ed5a81d455d02983e2e9fb33ebed32c8cacf670d"));
var confirmJobComplete = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1be583674653d5aa228d1af49753bc81c3d48802a6fed12fa005e9d68738a23d"));
var cancelJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("29db957cf4648afffedd458aefb61672e5bec8f4d58fb5be8594c5f063afc880"));
var requestChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4ecba637660cc9637db4f9b40c055312688141ed0d02d03cd1e8f14a2e42a887"));
var respondChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a813dccace21016a3a8bb6913f9332f5b1280f023f4dc4d23a6598923376a989"));
var openDispute = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7a35d499d0ad6e326e3a3a12592d9cc9148c03e16574f2cbd80f693e9b930840"));
var listThreads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2f5d3f4c6af3d079dc6e84d4da63e713b7bee323ae908b201d6f10496648146d"));
var listMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((jobId) => jobId).handler(createSsrRpc("8b4592a110660a71eaba89d0d4a85c97f139172466c3133cf6f0e6a117a2168e"));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("65b1df20a045a46dad81a57f215956d1a1aaee7a11c2d2702aca7e93b84bb142"));
var getProProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("bcf999454b038ca0640bb270f90f57d486fae49544a996b8e335b4ff53037941"));
var addFunds = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("879e5c1cbd9df8c98acc21217722e465cff21d247d4bfc32aa2e00de82e8052e"));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c9a4bb6bd749cfaa622ff1f3871be19f02bddd9500103d8c209d6bc20441289c"));
var getBidCheckout = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((bidId) => bidId).handler(createSsrRpc("2f48f6cc4552f4b044f1c42936daf1f1220c68d7665673f93d80567abff0b7bf"));
//#endregion
export { startJob as A, markJobComplete as C, requestChangeOrder as D, postJobFromDiagnosis as E, respondChangeOrder as O, listThreads as S, openDispute as T, listMarketJobs as _, completeOnboarding as a, listMyDiagnoses as b, createBid as c, getDiagnosis as d, getJobDetail as f, hireBid as g, getWallet as h, cancelJob as i, updateProfile as j, sendMessage as k, diagnosePhoto as l, getProProfile as m, UserButton as n, confirmDiagnosis as o, getMyProfile as p, addFunds as r, confirmJobComplete as s, RedirectToSignIn as t, getBidCheckout as u, listMessages as v, markOnTheWay as w, listMyJobs as x, listMyBids as y };
