import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addFunds, getBidCheckout, getMyProfile, hireBid } from "@/lib/handypix-api";
import { formatUsd, formatUsdExact } from "@/lib/format";
import { PLATFORM_FEE_BPS, TIME_WINDOW_LABEL } from "@/lib/handypix-types";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/hire/$bidId")({ component: HirePage });

function HirePage() {
  const { bidId } = Route.useParams();
  return (
    <AppShell>
      <HireBody bidId={bidId} />
    </AppShell>
  );
}

function HireBody({ bidId }: { bidId: string }) {
  const navigate = useNavigate();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const checkout = useQuery({
    queryKey: ["checkout", bidId],
    queryFn: () => getBidCheckout({ data: bidId }),
  });
  const [agreed, setAgreed] = useState(false);

  const hire = useMutation({
    mutationFn: () => hireBid({ data: { bidId } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error("Not enough in the wallet");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Booked. Funds are held until you confirm the work.");
      void navigate({ to: "/jobs/$id", params: { id: res.jobId } });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not hire"),
  });

  const topUp = useMutation({
    mutationFn: () => addFunds(),
    onSuccess: (p) => {
      queryClient.setQueryData(["profile"], p);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Added $500 demo funds");
    },
  });

  if (checkout.isPending || profile.isPending) {
    return <Skeleton className="h-80 w-full rounded-[24px]" />;
  }
  if (!checkout.data) {
    return <p className="text-sm text-muted">That bid is no longer available.</p>;
  }

  const { job, bid } = checkout.data;
  const fee = Math.round((bid.amountCents * PLATFORM_FEE_BPS) / 10_000);
  const wallet = profile.data?.walletCents ?? 0;
  const short = wallet < bid.amountCents;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Confirm & pay
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Hire {bid.pro.displayName}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {job.title}
        {job.preferredDate ? ` · ${job.preferredDate}` : ""} · {TIME_WINDOW_LABEL[job.timeWindow]}
      </p>
      <p className="mt-1 text-sm text-muted">
        {bid.availableWindow || "Window to be confirmed"} · {bid.warrantyDays}-day warranty
      </p>

      <section className="mt-6 space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]">
        <Row label="Labor" value={formatUsdExact(bid.laborCents)} muted />
        <Row label="Materials" value={formatUsdExact(bid.materialsCents)} muted />
        <Row label="Job estimate" value={formatUsdExact(bid.amountCents)} />
        <Row label="Platform fee (8%, withheld at release)" value={formatUsdExact(fee)} muted />
        <Row label="Pro receives after confirm" value={formatUsdExact(bid.amountCents - fee)} />
        <Row label="Authorized now" value={formatUsdExact(bid.amountCents)} />
        <Row label="Your wallet" value={formatUsdExact(wallet)} />
      </section>

      <section className="mt-4 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-[0.14em] text-subtle">Payment method</p>
        <p className="mt-2 text-sm">Visa ···· 4242 (demo wallet)</p>
      </section>

      <p className="mt-4 text-xs leading-relaxed text-subtle">
        Authorization holds the bid amount until you confirm the work. This is not a
        licensed escrow service — the ledger is a marketplace hold on a demo wallet.
        Swap this for Stripe Connect in production.
      </p>

      <label className="mt-4 flex min-h-11 items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>I agree to the service terms. Address is shared with the hired pro only.</span>
      </label>

      {short ? (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-warn">Add funds to cover this hire.</p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => topUp.mutate()}
            disabled={topUp.isPending}
          >
            Add $500 demo funds
          </Button>
        </div>
      ) : null}

      <Button
        className="mt-4 w-full"
        size="lg"
        disabled={short || hire.isPending || !agreed}
        onClick={() => hire.mutate()}
      >
        {hire.isPending ? "Holding funds…" : `Pay & book ${formatUsd(bid.amountCents)}`}
      </Button>
      <Button asChild variant="ghost" className="mt-2 w-full">
        <Link to="/jobs/$id" params={{ id: job.id }}>
          Back to bids
        </Link>
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? "text-muted" : ""}>{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}
