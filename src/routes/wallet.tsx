import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addFunds, getWallet } from "@/lib/handypix-api";
import { formatUsdExact, relativeTime } from "@/lib/format";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

function WalletPage() {
  return (
    <AppShell>
      <WalletBody />
    </AppShell>
  );
}

function WalletBody() {
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: () => getWallet() });
  const topUp = useMutation({
    mutationFn: () => addFunds(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Added $500 demo funds");
    },
  });

  if (wallet.isPending) return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!wallet.data) return null;

  const { profile, events } = wallet.data;
  const isPro = profile.role === "pro";

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {isPro ? "Earnings" : "Wallet"}
      </h1>
      <div className="mt-6 rounded-[28px] bg-surface p-6 shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-[0.16em] text-subtle">Available</p>
        <p className="mt-2 font-display text-4xl font-semibold tabular-nums tracking-tight">
          {formatUsdExact(profile.walletCents)}
        </p>
        <p className="mt-3 text-sm text-muted">
          {isPro
            ? "Payouts land here when a homeowner confirms the job."
            : "Used to hire. Funds sit in escrow until you confirm the work."}
        </p>
        {!isPro ? (
          <Button
            className="mt-5"
            variant="secondary"
            onClick={() => topUp.mutate()}
            disabled={topUp.isPending}
          >
            Add $500 demo funds
          </Button>
        ) : null}
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold">Activity</h2>
      <ul className="mt-3 divide-y divide-border">
        {events.length === 0 ? (
          <li className="py-6 text-sm text-muted">No movement yet.</li>
        ) : (
          events.map((e) => (
            <li key={e.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm">{e.note || e.kind}</p>
                <p className="text-xs text-subtle">{relativeTime(e.createdAt)}</p>
              </div>
              <span
                className={cn(
                  "tabular-nums text-sm font-medium",
                  e.amountCents < 0 ? "text-muted" : "text-success",
                )}
              >
                {e.amountCents > 0 ? "+" : ""}
                {formatUsdExact(e.amountCents)}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
