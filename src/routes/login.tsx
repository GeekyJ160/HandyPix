import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex">
          <Logo />
        </Link>
        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your home problem starts with a picture. One account for homeowners and
          pros.
        </p>
        <div className="mt-8 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/home" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <p className="mt-6 text-xs text-subtle">
          By continuing you agree to use this demo wallet for simulated payment holds
          only.
        </p>
      </div>
    </main>
  );
}
