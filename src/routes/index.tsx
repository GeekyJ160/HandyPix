import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { ArrowRight, Camera, Shield, Wallet, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SAMPLE_SCANS } from "@/lib/handypix-types";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/blueprint"
            className="hidden text-sm text-muted hover:text-fg sm:inline"
          >
            Blueprint
          </Link>
          <HeaderAuth />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20">
        <section className="pt-8 sm:pt-16">
          <div className="flex items-center gap-4">
            <img
              src="/brand/app-icon.jpg"
              alt="HandyPix AI"
              className="size-16 rounded-[18px] object-cover sm:size-20"
            />
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Snap it. Diagnose it. Fix it.
            </p>
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Your home problem starts with a picture.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Take a picture of what's wrong. HandyPix AI names the likely issue,
            gets bids from vetted local professionals, and holds payment until you
            confirm the work. Preliminary diagnosis — never a certified inspection.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HeaderAuth size="lg" />
            <Button asChild variant="secondary" size="lg">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SAMPLE_SCANS.map((s) => (
            <figure key={s.id} className="overflow-hidden rounded-[22px] bg-surface">
              <img
                src={s.src}
                alt={s.label}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="px-3 py-2.5">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-subtle">{s.hint}</p>
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="mt-16 grid gap-3 sm:grid-cols-3">
          <Step
            icon={<Camera className="size-5" />}
            n="01"
            title="Diagnose"
            copy="Grok reads the photo, flags safety, asks a clarifying question, and drafts the job description."
          />
          <Step
            icon={<Wrench className="size-5" />}
            n="02"
            title="Compare bids"
            copy="Matching trades send labor, materials, window, and warranty. You sort — the app does not pick a winner."
          />
          <Step
            icon={<Shield className="size-5" />}
            n="03"
            title="Hold & release"
            copy="Authorize the bid. The pro works. You confirm. Then they are paid, minus the platform fee."
          />
        </section>

        <section className="mt-16 rounded-[28px] bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
          <div className="flex items-start gap-3">
            <Wallet className="mt-1 size-5 text-accent" />
            <div>
              <h2 className="font-display text-xl font-semibold">Demo wallet</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                This preview uses a simulated payment hold so you can walk hire,
                change orders, disputes, and payout without a card processor.
                Homeowners start with $2,500. Pros earn when a job is confirmed.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeaderAuth({ size = "sm" }: { size?: "sm" | "lg" }) {
  const ssrUser = useRouteContext({ from: "__root__" }).sessionUser;
  const { user, isPending } = useCurrentUserState();
  const signedIn = Boolean(user ?? (isPending ? ssrUser : null));
  if (signedIn) {
    return (
      <Button asChild size={size}>
        <Link to={size === "lg" ? "/scan" : "/home"}>
          {size === "lg" ? (
            <>
              Get started
              <ArrowRight className="size-4" />
            </>
          ) : (
            "Open app"
          )}
        </Link>
      </Button>
    );
  }
  return (
    <Button asChild size={size} variant={size === "lg" ? "primary" : "secondary"}>
      <Link to="/login">
        {size === "lg" ? (
          <>
            Get started
            <ArrowRight className="size-4" />
          </>
        ) : (
          "Log in"
        )}
      </Link>
    </Button>
  );
}

function Step({
  icon,
  n,
  title,
  copy,
}: {
  icon: ReactNode;
  n: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-[22px] bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-[12px] bg-surface-2 text-accent">
          {icon}
        </span>
        <span className="font-display text-sm text-subtle">{n}</span>
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
    </div>
  );
}
