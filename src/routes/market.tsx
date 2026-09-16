import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { listMarketJobs } from "@/lib/handypix-api";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  type Category,
} from "@/lib/handypix-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market")({ component: MarketPage });

function MarketPage() {
  return (
    <AppShell>
      <MarketBody />
    </AppShell>
  );
}

function MarketBody() {
  const [category, setCategory] = useState<Category | "all">("all");
  const jobs = useQuery({
    queryKey: ["market", category],
    queryFn: () => listMarketJobs({ data: { category } }),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Market</h1>
      <p className="mt-1 text-sm text-muted">
        Open jobs around Dallas–Fort Worth. Bid with a firm price.
      </p>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <FilterChip
          label="All"
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={CATEGORY_LABEL[c]}
            active={category === c}
            onClick={() => setCategory(c)}
          />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {jobs.isPending ? (
          <>
            <Skeleton className="h-28 w-full rounded-[22px]" />
            <Skeleton className="h-28 w-full rounded-[22px]" />
          </>
        ) : (jobs.data ?? []).length === 0 ? (
          <p className="rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]">
            No open jobs in this trade right now.
          </p>
        ) : (
          jobs.data!.map((job) => <JobCard key={job.id} job={job} href="/jobs/$id" />)
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
        active ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
      )}
    >
      {label}
    </button>
  );
}
