import { Badge } from "@/components/ui/badge";
import {
  SEVERITY_LABEL,
  STATUS_LABEL,
  URGENCY_LABEL,
  type JobStatus,
  type Severity,
  type Urgency,
} from "@/lib/handypix-types";

export function severityTone(severity: Severity) {
  if (severity === "emergency") return "danger" as const;
  if (severity === "high") return "warn" as const;
  if (severity === "medium") return "accent" as const;
  return "neutral" as const;
}

export function SeverityBadge({ value }: { value: Severity }) {
  return <Badge tone={severityTone(value)}>{SEVERITY_LABEL[value]}</Badge>;
}

export function StatusBadge({ value }: { value: JobStatus }) {
  const tone =
    value === "complete"
      ? "success"
      : value === "in_progress" || value === "awaiting_confirm"
        ? "accent"
        : value === "cancelled"
          ? "danger"
          : "neutral";
  return <Badge tone={tone}>{STATUS_LABEL[value]}</Badge>;
}

export function UrgencyBadge({ value }: { value: Urgency }) {
  return (
    <Badge tone={value === "emergency" ? "danger" : "neutral"}>
      {URGENCY_LABEL[value]}
    </Badge>
  );
}
