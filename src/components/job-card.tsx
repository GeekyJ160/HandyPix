import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { StatusBadge, UrgencyBadge } from "@/components/status";
import { CATEGORY_LABEL, type JobRow } from "@/lib/handypix-types";
import { formatUsd, relativeTime } from "@/lib/format";

export function JobCard({
  job,
  href,
}: {
  job: JobRow;
  href: "/jobs/$id";
}) {
  return (
    <Link
      to={href}
      params={{ id: job.id }}
      className="group flex gap-3 rounded-[22px] bg-surface p-2 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-150 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_18%,transparent)]"
    >
      <img
        src={job.photoUrl}
        alt=""
        className="size-24 shrink-0 rounded-[14px] object-cover sm:size-28"
      />
      <div className="min-w-0 flex-1 py-1.5 pr-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge value={job.status} />
          <UrgencyBadge value={job.urgency} />
        </div>
        <h3 className="mt-1.5 truncate font-display text-base font-semibold tracking-tight">
          {job.title}
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          {CATEGORY_LABEL[job.category]} · {formatUsd(job.budgetMinCents)}–
          {formatUsd(job.budgetMaxCents)}
        </p>
        <p className="mt-2 flex items-center gap-3 text-xs text-subtle">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.zip}
          </span>
          <span>{job.bidCount} bids</span>
          <span>{relativeTime(job.createdAt)}</span>
        </p>
      </div>
    </Link>
  );
}
