import { AlertTriangle, Shield, ShieldCheck } from "lucide-react";
import { SAFETY_COPY, type SafetyLevel } from "@/lib/handypix-types";
import { cn } from "@/lib/utils";

export function SafetyBanner({ level }: { level: SafetyLevel }) {
  const copy = SAFETY_COPY[level];
  const Icon =
    level === "danger" ? AlertTriangle : level === "caution" ? Shield : ShieldCheck;
  return (
    <section
      className={cn(
        "rounded-[20px] p-4",
        level === "danger" && "bg-danger/12",
        level === "caution" && "bg-warn/12",
        level === "normal" && "bg-success/12",
      )}
    >
      <h3
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          level === "danger" && "text-danger",
          level === "caution" && "text-warn",
          level === "normal" && "text-success",
        )}
      >
        <Icon className="size-4" />
        {copy.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-fg/90">{copy.body}</p>
      {level === "danger" ? (
        <a
          href="tel:911"
          className="mt-3 inline-flex h-11 items-center rounded-[12px] bg-danger px-4 text-sm font-medium text-fg"
        >
          Call 911
        </a>
      ) : null}
    </section>
  );
}
