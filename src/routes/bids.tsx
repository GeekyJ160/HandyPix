import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listMyBids } from "@/lib/handypix-api";
import { formatUsd, relativeTime } from "@/lib/format";
import { CATEGORY_LABEL, type Category } from "@/lib/handypix-types";

export const Route = createFileRoute("/bids")({ component: BidsPage });

function BidsPage() {
  return (
    <AppShell>
      <BidsBody />
    </AppShell>
  );
}

function BidsBody() {
  const bids = useQuery({ queryKey: ["bids"], queryFn: () => listMyBids() });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your bids</h1>
      <p className="mt-1 text-sm text-muted">Track pending, hired, and closed work.</p>
      <div className="mt-6 space-y-3">
        {bids.isPending ? (
          <Skeleton className="h-24 w-full rounded-[22px]" />
        ) : (bids.data ?? []).length === 0 ? (
          <p className="rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]">
            You have not bid yet. Open the market to find work.
          </p>
        ) : (
          bids.data!.map((b) => (
            <Link
              key={b.id}
              to="/jobs/$id"
              params={{ id: b.jobId }}
              className="flex gap-3 rounded-[22px] bg-surface p-2 shadow-[var(--shadow-border)]"
            >
              <img
                src={b.photoUrl}
                alt=""
                className="size-20 rounded-[14px] object-cover"
              />
              <div className="min-w-0 flex-1 py-1 pr-2">
                <div className="flex items-center gap-2">
                  <BidStatus status={b.status} />
                  <span className="text-xs text-subtle">
                    {CATEGORY_LABEL[(b.category as Category) ?? "other"] ?? b.category}
                  </span>
                </div>
                <p className="mt-1 truncate font-medium">{b.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatUsd(b.amountCents)} · {b.zip} · {relativeTime(b.createdAt)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function BidStatus({ status }: { status: string }) {
  const tone =
    status === "accepted"
      ? "success"
      : status === "declined" || status === "withdrawn"
        ? "danger"
        : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
