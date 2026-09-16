import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { completeOnboarding, getMyProfile } from "@/lib/handypix-api";
import { CATEGORIES, CATEGORY_LABEL, type Category, type Role } from "@/lib/handypix-types";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const sessionUser = useCurrentUser();
  const navigate = useNavigate();
  const existing = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
  });
  const [role, setRole] = useState<Role>("homeowner");
  const [displayName, setDisplayName] = useState(sessionUser?.displayName ?? "");
  const [city, setCity] = useState("Dallas");
  const [zip, setZip] = useState("75201");
  const [trades, setTrades] = useState<Category[]>(["plumbing"]);

  const mutate = useMutation({
    mutationFn: () =>
      completeOnboarding({
        data: { role, displayName, city, zip, trades },
      }),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      toast.success(role === "pro" ? "Pro profile ready" : "You are set to hire");
      void navigate({ to: role === "pro" ? "/market" : "/home" });
    },
    onError: () => toast.error("Could not finish setup"),
  });

  if (isPending || existing.isPending) {
    return <main className="min-h-dvh bg-bg" />;
  }
  if (!user) return <RedirectToSignIn />;
  if (existing.data) {
    void navigate({ to: existing.data.role === "pro" ? "/market" : "/home" });
    return null;
  }

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-5 py-10">
      <Logo />
      <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">
        How will you use HandyPix?
      </h1>
      <p className="mt-2 text-sm text-muted">You can switch later in profile.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <RoleCard
          active={role === "homeowner"}
          icon={<Camera className="size-5" />}
          title="I need it fixed"
          copy="Snap a problem, get a diagnosis, hire a pro."
          onClick={() => setRole("homeowner")}
        />
        <RoleCard
          active={role === "pro"}
          icon={<Wrench className="size-5" />}
          title="I am a pro"
          copy="Browse jobs near you and bid with a firm price."
          onClick={() => setRole("pro")}
        />
      </div>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutate.mutate();
        }}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="zip">ZIP</Label>
            <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
        </div>
        {role === "pro" ? (
          <div>
            <Label>Trades</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const on = trades.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setTrades((prev) =>
                        on ? prev.filter((x) => x !== c) : [...prev, c],
                      )
                    }
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      on ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                    )}
                  >
                    {CATEGORY_LABEL[c]}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={mutate.isPending}>
          {mutate.isPending ? "Saving…" : "Continue"}
        </Button>
      </form>
    </main>
  );
}

function RoleCard({
  active,
  icon,
  title,
  copy,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  copy: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[22px] bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-shadow",
        active && "shadow-[0_0_0_1px_var(--color-accent)]",
      )}
    >
      <span className="grid size-10 place-items-center rounded-[12px] bg-surface-2 text-accent">
        {icon}
      </span>
      <p className="mt-3 font-display font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{copy}</p>
    </button>
  );
}
