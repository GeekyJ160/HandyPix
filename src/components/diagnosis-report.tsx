import { Clock, Hammer, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { SafetyBanner } from "@/components/safety-banner";
import { SeverityBadge } from "@/components/status";
import {
  CATEGORY_LABEL,
  COMPLEXITY_LABEL,
  type DiagnosisResult,
} from "@/lib/handypix-types";
import { formatUsd } from "@/lib/format";

export function DiagnosisReport({ result }: { result: DiagnosisResult }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge value={result.severity} />
          <span className="text-xs text-muted">{CATEGORY_LABEL[result.category]}</span>
          <span className="text-xs text-subtle">{COMPLEXITY_LABEL[result.complexity]}</span>
          <span className="text-xs text-subtle">{result.confidence}% confidence</span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {result.issue}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{result.summary}</p>
      </div>

      <SafetyBanner level={result.safety_level} />

      {result.observations.length > 0 ? (
        <section className="rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
          <h3 className="text-sm font-semibold">What we see</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            {result.observations.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          icon={<Clock className="size-4" />}
          label="Labor"
          value={`${result.est_labor_hours} hrs`}
        />
        <Stat
          icon={<Wrench className="size-4" />}
          label="Est. range"
          value={`${formatUsd(result.est_cost_min_cents)}–${formatUsd(result.est_cost_max_cents)}`}
        />
        <Stat
          icon={<Hammer className="size-4" />}
          label="DIY"
          value={result.diy_possible ? result.diy_difficulty : "Call a pro"}
        />
      </div>

      <section className="rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
        <h3 className="text-sm font-semibold">Likely cause</h3>
        <p className="mt-1 text-sm text-muted">{result.likely_cause}</p>
      </section>

      {result.diy_possible && result.diy_steps.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold">If you DIY</h3>
          <ol className="mt-2 space-y-2">
            {result.diy_steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-muted">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-fg">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ) : result.when_to_call_pro ? (
        <p className="text-sm text-muted">{result.when_to_call_pro}</p>
      ) : null}

      {result.parts.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold">Likely parts</h3>
          <ul className="mt-2 divide-y divide-border">
            {result.parts.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span>{p.name}</span>
                <span className="tabular-nums text-muted">
                  {formatUsd(p.est_cost_cents)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.tools_needed.length > 0 ? (
        <p className="text-xs text-subtle">Tools: {result.tools_needed.join(", ")}</p>
      ) : null}

      <p className="text-xs leading-relaxed text-subtle">
        AI assessment: this is a preliminary visual read and may be wrong. A
        professional should verify the problem before repair.
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] bg-surface p-3 shadow-[var(--shadow-border)]">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-subtle">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-sm font-semibold tracking-tight">{value}</p>
    </div>
  );
}
