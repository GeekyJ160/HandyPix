import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Shield, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProProfile } from "@/lib/handypix-api";
import { formatRating, formatUsd, initials } from "@/lib/format";
import { CATEGORY_LABEL, REVIEW_TAGS } from "@/lib/handypix-types";

export const Route = createFileRoute("/pros/$id")({ component: ProPage });

function ProPage() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <ProBody id={id} />
    </AppShell>
  );
}

function ProBody({ id }: { id: string }) {
  const q = useQuery({
    queryKey: ["pro", id],
    queryFn: () => getProProfile({ data: id }),
  });
  if (q.isPending) return <Skeleton className="h-80 w-full rounded-[24px]" />;
  if (!q.data) return <p className="text-sm text-muted">Pro not found.</p>;
  const { pro, portfolio } = q.data;

  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-surface-2 font-display text-xl">
          {initials(pro.displayName)}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {pro.displayName}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <Star className="size-4 fill-warn text-warn" />
            {formatRating(pro.ratingX10)} · {pro.jobsCompleted} completed jobs · {pro.city}
          </p>
          <p className="mt-1 text-xs text-subtle">{pro.distanceMiles.toFixed(1)} miles away</p>
        </div>
      </div>

      <section className="mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Verification</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {pro.identityVerified ? (
            <li className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent" /> Identity verified
            </li>
          ) : null}
          {pro.backgroundCheck ? (
            <li className="flex items-center gap-2">
              <Shield className="size-4 text-accent" /> Background check completed
            </li>
          ) : null}
          {pro.insurance ? (
            <li className="flex items-center gap-2">
              <Shield className="size-4 text-accent" /> Insurance information provided
            </li>
          ) : (
            <li className="text-muted">Insurance not on file</li>
          )}
        </ul>
        <p className="mt-3 text-xs text-subtle">
          Badges only appear when the platform has actually checked them.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {pro.trades.map((t) => (
            <Badge key={t}>{CATEGORY_LABEL[t]}</Badge>
          ))}
        </div>
        {pro.bio ? <p className="mt-3 text-sm leading-relaxed text-muted">{pro.bio}</p> : null}
        <p className="mt-2 text-xs text-subtle">
          Typical rate {formatUsd(pro.hourlyRateCents)}/hr · {pro.yearsExp} years
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Reviews</h2>
        <div className="mt-3 space-y-3">
          {pro.reviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet.</p>
          ) : (
            pro.reviews.map((r, i) => (
              <article
                key={`${r.author}-${i}`}
                className="rounded-[18px] bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <p className="text-sm font-medium">
                  {r.author} · {r.rating}/5
                </p>
                <p className="mt-1 text-sm text-muted">{r.comment}</p>
                {r.tags.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.tags.map((t) => (
                      <Badge key={t} tone="accent">
                        {REVIEW_TAGS.find((x) => x.id === t)?.label ?? t}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Portfolio</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {portfolio.map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-[16px] bg-surface">
              <img src={p.src} alt="" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="px-2 py-2 text-xs text-muted">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Button asChild variant="ghost" className="mt-8 w-full">
        <Link to="/jobs">Back to jobs</Link>
      </Button>
    </div>
  );
}
