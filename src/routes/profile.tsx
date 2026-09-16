import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyProfile, updateProfile } from "@/lib/handypix-api";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  type Category,
  type Role,
} from "@/lib/handypix-types";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  return (
    <AppShell>
      <ProfileBody />
    </AppShell>
  );
}

function ProfileBody() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<Role>("homeowner");
  const [trades, setTrades] = useState<Category[]>([]);
  const [hourly, setHourly] = useState("85");

  useEffect(() => {
    if (!profile.data) return;
    setDisplayName(profile.data.displayName);
    setCity(profile.data.city);
    setZip(profile.data.zip);
    setBio(profile.data.bio);
    setRole(profile.data.role);
    setTrades(profile.data.trades);
    setHourly(String(Math.round(profile.data.hourlyRateCents / 100) || 85));
  }, [profile.data]);

  const save = useMutation({
    mutationFn: () =>
      updateProfile({
        data: {
          displayName,
          city,
          zip,
          bio,
          role,
          trades,
          hourlyRateCents: Math.round(Number(hourly) * 100),
        },
      }),
    onSuccess: (p) => {
      queryClient.setQueryData(["profile"], p);
      toast.success("Profile saved");
    },
    onError: () => toast.error("Could not save"),
  });

  if (profile.isPending) return <Skeleton className="h-64 w-full rounded-[24px]" />;
  if (!profile.data) return null;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Profile</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          {(["homeowner", "pro"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "rounded-[16px] px-3 py-3 text-sm font-medium shadow-[var(--shadow-border)]",
                role === r ? "bg-accent text-accent-fg" : "bg-surface text-muted",
              )}
            >
              {r === "homeowner" ? "Homeowner" : "Pro"}
            </button>
          ))}
        </div>
        <div>
          <Label htmlFor="n">Name</Label>
          <Input id="n" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="c">City</Label>
            <Input id="c" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="z">ZIP</Label>
            <Input id="z" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="b">Bio</Label>
          <Textarea id="b" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        {role === "pro" ? (
          <>
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
            <div>
              <Label htmlFor="h">Hourly rate (USD)</Label>
              <Input
                id="h"
                type="number"
                min={20}
                value={hourly}
                onChange={(e) => setHourly(e.target.value)}
              />
            </div>
          </>
        ) : null}
        <Button type="submit" className="w-full" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save profile"}
        </Button>
      </form>
      <div className="mt-6 flex flex-col gap-2">
        <Link to="/wallet" className="text-sm text-muted hover:text-fg">
          {role === "pro" ? "Earnings" : "Wallet"}
        </Link>
        <Link to="/blueprint" className="text-sm text-muted hover:text-fg">
          Product blueprint
        </Link>
      </div>
    </div>
  );
}
