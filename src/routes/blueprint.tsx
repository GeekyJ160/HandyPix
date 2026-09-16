import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blueprint")({ component: BlueprintPage });

function BlueprintPage() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Logo />
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </Button>
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Product blueprint
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          HandyPix AI
        </h1>
        <p className="mt-1 text-sm text-accent">Snap it. Diagnose it. Fix it.</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Take a picture of what's wrong. HandyPix AI helps identify the likely
          issue, gets bids from vetted local professionals, lets you compare them,
          and handles the job and payment in one place.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          AI is a preliminary visual assessment — never a guaranteed inspection.
          Electrical, gas, structural, roofing, plumbing, and HVAC issues recommend
          a licensed pro. Dangerous situations surface emergency guidance instead
          of a bid.
        </p>

        <Section title="Customer journey">
          <ol className="space-y-1.5 text-sm text-muted">
            {[
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
              "Funds release to the pro minus platform fee → review",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Section>

        <Section title="Screens and primary buttons">
          <Table
            rows={[
              ["Welcome", "/", "Get started, Log in. Tagline and sample jobs."],
              ["Sign in", "/login", "Continue with Google or X"],
              ["Onboarding", "/onboarding", "Homeowner vs Pro, name, city, ZIP, trades"],
              [
                "Home",
                "/home",
                "Take a photo, Upload, Video, My jobs, trade chips, active jobs",
              ],
              [
                "Capture",
                "/scan",
                "Take photo, Retake, Use photo, Add photo, Add video still, Diagnose",
              ],
              [
                "Diagnosis",
                "/diagnosis/:id",
                "Looks right, Something else, follow-up chips, Call 911 on danger",
              ],
              [
                "Post job",
                "on diagnosis",
                "Edit description, date, window, budget → Get local bids",
              ],
              [
                "Job / bids",
                "/jobs/:id",
                "Sort bids, Accept bid, View profile, Message, Cancel",
              ],
              ["Pro profile", "/pros/:id", "Verification, skills, reviews, portfolio"],
              [
                "Checkout",
                "/hire/:bidId",
                "Terms checkbox, Pay & book. Demo Visa on wallet.",
              ],
              [
                "Tracking",
                "/jobs/:id",
                "I'm on my way, Start job, Submit completion, Request additional work",
              ],
              [
                "Confirm",
                "/jobs/:id",
                "Looks good — complete job, Report a problem, star + tags",
              ],
              ["Messages", "/messages", "In-app thread. Numbers stay masked."],
              ["Wallet / Earnings", "/wallet", "Hold, release, refund, Add $500 demo funds"],
              ["Market (pro)", "/market", "Open jobs by trade, Submit bid or Pass"],
              ["Bids (pro)", "/bids", "Pending, hired, closed"],
              ["Profile", "/profile", "Switch Homeowner / Pro"],
            ]}
          />
        </Section>

        <Section title="Navigation">
          <p className="text-sm text-muted">
            Homeowner tabs: Home · Jobs · Messages · Wallet · Profile. Capture lives
            on Home, not as a fifth duplicate tab. Pro tabs: Jobs · Bids · Messages ·
            Earnings · Profile.
          </p>
        </Section>

        <Section title="Database">
          <p className="mb-3 text-sm text-muted">
            Postgres (Neon in production, local fallback in preview). Auth users own
            every personal row via user_id. Seed listings use seed: ids so one signed-in
            visitor can still walk the marketplace.
          </p>
          <Table
            rows={[
              ["profiles", "role, name, city, ZIP, trades, rates, wallet, ratings"],
              [
                "diagnoses",
                "photo(s), structured Grok result (observations, safety_level, follow-up), job_id",
              ],
              [
                "jobs",
                "category, diagnosis JSON, status, ZIP, budget band, preferred date, time window, timeline timestamps, work notes, after photo",
              ],
              [
                "bids",
                "labor, materials, total, ETA, warranty, duration, window, distance, pending/accepted/declined",
              ],
              ["payments", "authorized hold → released or refunded, amount, 8% fee"],
              ["wallet_events", "credits, holds, releases, refunds"],
              ["reviews", "rating, comment, tags after confirm"],
              ["messages", "job thread, from_id, body"],
              ["change_orders", "reason, extra labor/materials, pending/approved/declined"],
              ["disputes", "reason, details, open/resolved — funds stay held"],
              ["seed_pros", "eight DFW tradespeople with verification and reviews"],
            ]}
          />
        </Section>

        <Section title="AI diagnosis flow">
          <ol className="space-y-3 text-sm text-muted">
            <li>
              <strong className="text-fg">1. Capture.</strong> Camera, library, or a
              second angle. Client resizes to 960px JPEG. Originals stay on the job
              record.
            </li>
            <li>
              <strong className="text-fg">2. Diagnose.</strong> Signed-in server call
              to grok-4.5 with the photo. JSON: issue, trade, severity, safety_level
              (normal / caution / danger), complexity, observations, follow-up
              question, DIY, parts, Dallas cost range, confidence.
            </li>
            <li>
              <strong className="text-fg">3. Confirm.</strong> Homeowner answers the
              follow-up, then Looks right or Something else. The answer is written
              into the job description.
            </li>
            <li>
              <strong className="text-fg">4. Safety gate.</strong> Danger blocks
              bidding and shows emergency guidance. Caution still posts, with a
              professional-inspection warning. Routine continues.
            </li>
            <li>
              <strong className="text-fg">5. Draft.</strong> AI writes a real job
              description instead of “sink leaking idk.” Homeowner can edit before
              Get local bids.
            </li>
          </ol>
        </Section>

        <Section title="Matching and bidding">
          <p className="mb-3 text-sm text-muted">
            Matching uses distance, category, skills, availability, verification,
            completed jobs, rating, and response history. The UI never shows an
            opaque “AI score.” Customers see miles, stars, jobs, trades, and a
            window.
          </p>
          <ol className="space-y-3 text-sm text-muted">
            <li>
              <strong className="text-fg">Notify.</strong> Seeded Dallas pros in the
              matching trade bid instantly so the loop is playable with one account.
              Real pros can also bid.
            </li>
            <li>
              <strong className="text-fg">Submit.</strong> Labor, materials, total,
              available window, duration, warranty days, and a note. Pass leaves the
              listing.
            </li>
            <li>
              <strong className="text-fg">Compare.</strong> Sort by price, rating,
              distance, completed jobs, or warranty. Cheapest is not auto-selected.
            </li>
            <li>
              <strong className="text-fg">Award.</strong> One bid accepted; the rest
              decline. Demo market jobs with auto-hire accept a real pro bid so
              payout can be walked.
            </li>
          </ol>
        </Section>

        <Section title="Payment, change orders, disputes">
          <ol className="space-y-3 text-sm text-muted">
            <li>
              <strong className="text-fg">Authorize.</strong> Bid amount leaves the
              homeowner wallet and is marked held. Production should use Stripe
              Connect (or similar) — this preview is a ledger, not a licensed escrow
              product.
            </li>
            <li>
              <strong className="text-fg">Change order.</strong> If the job is larger
              than quoted, the pro requests extra labor and materials. The homeowner
              approves (additional hold) or declines. No silent re-price.
            </li>
            <li>
              <strong className="text-fg">Release.</strong> Homeowner confirms and
              rates. Net (bid − 8% fee, plus approved extras) credits the pro.
              Seed payers skip the wallet debit.
            </li>
            <li>
              <strong className="text-fg">Dispute.</strong> Not completed, differs,
              damage, unexpected price, no-show, or other. Collects photos, bid,
              messages, completion notes. Funds stay held for admin review.
            </li>
          </ol>
        </Section>

        <Section title="Development plan">
          <div className="space-y-4">
            <Phase
              n="v1 — this app"
              items={[
                "Auth (Google / X), homeowner and pro roles",
                "Vision diagnosis with grok-4.5, safety levels, follow-up",
                "Job post, bid compare, hire, payment hold, timeline, review",
                "Change orders, disputes, in-app messages",
                "Dallas seed market so one user can play both sides",
              ]}
            />
            <Phase
              n="v2 — real money and trust"
              items={[
                "Stripe Connect for cards and pro payouts",
                "ID, license, insurance, and background verification (only then show badges)",
                "Masked voice/SMS, calendar arrival windows, GPS start-job check",
                "Admin dispute console",
              ]}
            />
            <Phase
              n="v3 — density"
              items={[
                "Live map of nearby open jobs",
                "Materials marketplace from the parts list",
                "Recurring maintenance plans",
                "Video diagnosis and multi-trade jobs",
              ]}
            />
          </div>
        </Section>

        <Button asChild className="mt-10 w-full" size="lg">
          <Link to="/login">Start in the app</Link>
        </Button>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-surface shadow-[var(--shadow-border)]">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row[0] + row[1]} className="border-t border-border first:border-t-0">
              <th className="w-[34%] px-3 py-2.5 align-top font-medium">{row[0]}</th>
              <td className="px-3 py-2.5 text-muted">{row.slice(1).join(" — ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Phase({ n, items }: { n: string; items: string[] }) {
  return (
    <div className="rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
      <h3 className="text-sm font-semibold">{n}</h3>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
