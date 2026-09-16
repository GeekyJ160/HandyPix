import { Check } from "lucide-react";
import type { JobRow, PaymentRow } from "@/lib/handypix-types";
import { cn } from "@/lib/utils";

export function JobTimeline({
  job,
  payment,
}: {
  job: JobRow;
  payment: PaymentRow | null;
}) {
  const steps = [
    { id: "accepted", label: "Bid accepted", done: Boolean(job.awardedBidId) },
    {
      id: "paid",
      label: "Payment authorized",
      done: Boolean(payment),
    },
    {
      id: "booked",
      label: "Appointment confirmed",
      done: Boolean(job.awardedAt) || job.status !== "open",
    },
    { id: "way", label: "On the way", done: Boolean(job.onTheWayAt) },
    { id: "start", label: "Job started", done: Boolean(job.startedAt) },
    {
      id: "done",
      label: "Job completed",
      done: job.status === "awaiting_confirm" || job.status === "complete",
    },
    {
      id: "released",
      label: "Payment released",
      done: payment?.status === "released" || job.status === "complete",
    },
  ];

  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full",
                step.done ? "bg-accent text-accent-fg" : "bg-surface-2 text-subtle",
              )}
            >
              {step.done ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-subtle" />}
            </span>
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "w-px flex-1 min-h-4",
                  step.done ? "bg-accent/50" : "bg-border",
                )}
              />
            ) : null}
          </div>
          <p
            className={cn(
              "pb-4 text-sm",
              step.done ? "text-fg" : "text-muted",
            )}
          >
            {step.label}
          </p>
        </li>
      ))}
    </ol>
  );
}
