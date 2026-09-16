import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Clock, MapPin, MessageSquare, Shield, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { DiagnosisReport } from "@/components/diagnosis-report";
import { JobTimeline } from "@/components/job-timeline";
import { StatusBadge, UrgencyBadge } from "@/components/status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cancelJob,
  confirmJobComplete,
  createBid,
  getJobDetail,
  getMyProfile,
  markJobComplete,
  markOnTheWay,
  openDispute,
  requestChangeOrder,
  respondChangeOrder,
  startJob,
} from "@/lib/handypix-api";
import { formatRating, formatUsd, formatUsdExact, initials, relativeTime } from "@/lib/format";
import {
  CATEGORY_LABEL,
  DISPUTE_REASONS,
  REVIEW_TAGS,
  TIME_WINDOW_LABEL,
  type BidRow,
} from "@/lib/handypix-types";
import { fileToDataUrl } from "@/lib/image";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs/$id")({ component: JobPage });

type BidSort = "price" | "rating" | "distance" | "warranty" | "jobs";

function JobPage() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <JobBody id={id} />
    </AppShell>
  );
}

function JobBody({ id }: { id: string }) {
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const detail = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobDetail({ data: id }),
  });
  const [sort, setSort] = useState<BidSort>("price");

  if (detail.isPending) return <Skeleton className="h-96 w-full rounded-[24px]" />;
  if (!detail.data) return <p className="text-sm text-muted">Job not found.</p>;

  const { job, bids, payment, isOwner, myBid, review, changeOrders, dispute } = detail.data;
  const role = profile.data?.role;
  const accepted = bids.find((b) => b.status === "accepted");
  const pendingChange = changeOrders.find((c) => c.status === "pending");

  const sorted = [...bids].sort((a, b) => {
    if (sort === "rating") return b.pro.ratingX10 - a.pro.ratingX10;
    if (sort === "distance") return a.distanceMiles - b.distanceMiles;
    if (sort === "warranty") return b.warrantyDays - a.warrantyDays;
    if (sort === "jobs") return b.pro.jobsCompleted - a.pro.jobsCompleted;
    return a.amountCents - b.amountCents;
  });

  return (
    <div>
      <img
        src={job.photoUrl}
        alt=""
        className="h-52 w-full rounded-[24px] object-cover sm:h-64"
      />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge value={job.status} />
        <UrgencyBadge value={job.urgency} />
        <span className="text-xs text-muted">{CATEGORY_LABEL[job.category]}</span>
      </div>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        {job.title}
      </h1>
      <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {job.zip} · {job.posterName}
        </span>
        <span>{relativeTime(job.createdAt)}</span>
        <span className="tabular-nums">
          {formatUsd(job.budgetMinCents)}–{formatUsd(job.budgetMaxCents)}
        </span>
      </p>
      <p className="mt-1 text-xs text-subtle">
        {job.preferredDate ? job.preferredDate : "Date flexible"} ·{" "}
        {TIME_WINDOW_LABEL[job.timeWindow]} · Address hidden until hire
      </p>
      {job.description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{job.description}</p>
      ) : null}

      {job.isSeed && job.autoAward && role === "pro" ? (
        <p className="mt-4 rounded-[16px] bg-accent-dim px-3 py-2 text-xs text-accent">
          Demo listing — a qualified bid is auto-hired so you can walk the payout loop.
        </p>
      ) : null}

      {job.diagnosis ? (
        <details className="mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
          <summary className="cursor-pointer text-sm font-semibold">
            AI preliminary diagnosis
          </summary>
          <div className="mt-4">
            <DiagnosisReport result={job.diagnosis} />
          </div>
        </details>
      ) : null}

      {job.status !== "open" ? (
        <section className="mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-semibold">Timeline</h2>
          <div className="mt-3">
            <JobTimeline job={job} payment={payment} />
          </div>
          {accepted ? (
            <p className="mt-2 text-sm text-muted">
              {accepted.pro.displayName} · {formatUsd(accepted.amountCents)}
            </p>
          ) : null}
          {job.status !== "complete" && job.status !== "cancelled" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link to="/messages" search={{ job: job.id }}>
                  <MessageSquare className="size-4" />
                  Message
                </Link>
              </Button>
              {(isOwner || (role === "pro" && myBid?.status === "accepted")) &&
              !job.startedAt ? (
                <CancelButton jobId={job.id} />
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {payment ? (
        <section className="mt-6 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-semibold">Payment hold</h2>
          <p className="mt-1 text-sm text-muted">
            {formatUsdExact(payment.amountCents)} {payment.status}
            {payment.status === "escrowed" ? " — released after you confirm the work" : ""}
            {" · "}platform fee {formatUsdExact(payment.feeCents)}
          </p>
        </section>
      ) : null}

      {pendingChange && isOwner ? (
        <ChangeOrderCard
          jobId={job.id}
          original={accepted?.amountCents ?? 0}
          reason={pendingChange.reason}
          extra={pendingChange.laborCents + pendingChange.materialsCents}
          id={pendingChange.id}
        />
      ) : null}

      {changeOrders
        .filter((c) => c.status !== "pending")
        .map((c) => (
          <p key={c.id} className="mt-3 text-xs text-muted">
            Change order {c.status}: {formatUsd(c.laborCents + c.materialsCents)} — {c.reason}
          </p>
        ))}

      {dispute ? (
        <p className="mt-4 rounded-[16px] bg-warn/12 px-3 py-2 text-sm text-warn">
          Dispute open — {dispute.reason}. Funds stay held while an admin reviews the
          photos, bid, and messages.
        </p>
      ) : null}

      {isOwner && job.status === "open" ? (
        <section className="mt-8">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Your bids</h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as BidSort)}
              className="h-9 rounded-[10px] bg-surface-2 px-2 text-xs text-fg shadow-[var(--shadow-border)]"
            >
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
              <option value="jobs">Completed jobs</option>
              <option value="warranty">Warranty</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-subtle">
            Sorted lists are a view, not a recommendation. Pick the person you trust.
          </p>
          <div className="mt-3 space-y-3">
            {sorted.length === 0 ? (
              <p className="text-sm text-muted">Waiting on the first bid.</p>
            ) : (
              sorted.map((bid) => <BidCard key={bid.id} bid={bid} hireable />)
            )}
          </div>
        </section>
      ) : null}

      {isOwner && accepted && job.status === "in_progress" ? (
        <section className="mt-8 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-semibold">Hired</h2>
          <p className="mt-1 text-sm text-muted">
            {accepted.pro.displayName} is booked for {formatUsd(accepted.amountCents)}.
            {job.onTheWayAt && !job.startedAt ? " They have started traveling." : ""}
            {job.startedAt ? ` Job started ${new Date(job.startedAt).toLocaleTimeString()}.` : ""}
          </p>
        </section>
      ) : null}

      {isOwner && job.status === "awaiting_confirm" ? (
        <ConfirmForm
          jobId={job.id}
          proName={accepted?.pro.displayName ?? "the pro"}
          beforeUrl={job.photoUrl}
          afterUrl={job.afterPhotoUrl}
          work={job.workPerformed}
        />
      ) : null}

      {isOwner && job.status === "complete" ? (
        <p className="mt-8 text-sm text-success">
          Job complete
          {review ? ` · ${review.rating}/5` : ""}. Funds released.
        </p>
      ) : null}

      {role === "pro" && !isOwner && job.status === "open" ? (
        <BidForm
          jobId={job.id}
          defaultAmount={myBid?.amountCents ?? job.budgetMinCents}
          existing={myBid}
        />
      ) : null}

      {role === "pro" && myBid?.status === "accepted" && job.status === "in_progress" ? (
        <ProJobActions
          jobId={job.id}
          onTheWay={Boolean(job.onTheWayAt)}
          started={Boolean(job.startedAt)}
        />
      ) : null}

      {role === "pro" && !isOwner && bids.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold">Other bids</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {bids
              .filter((b) => b.proId !== profile.data?.userId)
              .map((b) => (
                <li key={b.id} className="flex justify-between">
                  <span>{b.pro.displayName}</span>
                  <span className="tabular-nums">{formatUsd(b.amountCents)}</span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function BidCard({ bid, hireable }: { bid: BidRow; hireable?: boolean }) {
  return (
    <article className="rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-start gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-sm font-semibold">
          {initials(bid.pro.displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{bid.pro.displayName}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <Star className="size-3 fill-warn text-warn" />
                {formatRating(bid.pro.ratingX10)} · {bid.pro.jobsCompleted} jobs ·{" "}
                {bid.distanceMiles.toFixed(1)} mi
              </p>
            </div>
            <p className="font-display text-lg font-semibold tabular-nums">
              {formatUsd(bid.amountCents)}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{bid.message}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-subtle">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {bid.availableWindow || `${bid.etaDays} day window`}
            </span>
            <span>{bid.durationMinutes} min</span>
            <span>{bid.warrantyDays}-day warranty</span>
            {bid.materialsIncluded ? (
              <Badge tone="accent">Materials in</Badge>
            ) : (
              <Badge>Labor only</Badge>
            )}
          </div>
          <p className="mt-2 text-xs text-subtle">
            Labor {formatUsd(bid.laborCents)} · Materials {formatUsd(bid.materialsCents)}
          </p>
          <div className="mt-4 flex gap-2">
            {hireable && bid.status === "pending" ? (
              <Button asChild className="flex-1" size="sm">
                <Link to="/hire/$bidId" params={{ bidId: bid.id }}>
                  Accept bid
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="secondary" size="sm">
              <Link to="/pros/$id" params={{ id: bid.proId }}>
                View profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function BidForm({
  jobId,
  defaultAmount,
  existing,
}: {
  jobId: string;
  defaultAmount: number;
  existing: BidRow | null;
}) {
  const [labor, setLabor] = useState(
    String(Math.round((existing?.laborCents ?? Math.round(defaultAmount * 0.78)) / 100)),
  );
  const [materials, setMaterials] = useState(
    String(Math.round((existing?.materialsCents ?? Math.round(defaultAmount * 0.22)) / 100)),
  );
  const [eta, setEta] = useState(String(existing?.etaDays ?? 2));
  const [message, setMessage] = useState(existing?.message ?? "");
  const [warranty, setWarranty] = useState(String(existing?.warrantyDays ?? 30));
  const [duration, setDuration] = useState(String(existing?.durationMinutes ?? 60));
  const [avail, setAvail] = useState(existing?.availableWindow ?? "Saturday 9:00–11:00 AM");
  const materialsIncluded = Number(materials) > 0;
  const total = (Number(labor) || 0) + (Number(materials) || 0);

  const mutate = useMutation({
    mutationFn: () =>
      createBid({
        data: {
          jobId,
          laborCents: Math.round(Number(labor) * 100),
          materialsCents: Math.round(Number(materials) * 100),
          amountCents: Math.round(total * 100),
          etaDays: Number(eta),
          message,
          materialsIncluded,
          warrantyDays: Number(warranty),
          durationMinutes: Number(duration),
          availableWindow: avail,
        },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["market"] });
      if (res.autoAwarded) toast.success("Hired — funds are held");
      else toast.success("Bid sent");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not bid"),
  });

  return (
    <form
      className="mt-8 space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]"
      onSubmit={(e) => {
        e.preventDefault();
        mutate.mutate();
      }}
    >
      <h2 className="font-display text-lg font-semibold">
        {existing ? "Update your bid" : "Submit bid"}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="labor">Labor (USD)</Label>
          <Input
            id="labor"
            type="number"
            min={20}
            value={labor}
            onChange={(e) => setLabor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="mats">Materials (USD)</Label>
          <Input
            id="mats"
            type="number"
            min={0}
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
          />
        </div>
      </div>
      <p className="text-sm text-muted">
        Total estimate <span className="font-medium text-fg tabular-nums">{formatUsd(total * 100)}</span>
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="eta">Days to start</Label>
          <Input id="eta" type="number" min={1} max={30} value={eta} onChange={(e) => setEta(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="dur">Duration (min)</Label>
          <Input
            id="dur"
            type="number"
            min={15}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="win">Available window</Label>
        <Input id="win" value={avail} onChange={(e) => setAvail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="war">Warranty (days)</Label>
        <Input id="war" type="number" min={0} value={warranty} onChange={(e) => setWarranty(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="msg">Note to homeowner</Label>
        <Textarea
          id="msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What you will do, and what is not included"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={mutate.isPending}>
        {mutate.isPending ? "Sending…" : existing ? "Update bid" : "Submit bid"}
      </Button>
    </form>
  );
}

function ProJobActions({
  jobId,
  onTheWay,
  started,
}: {
  jobId: string;
  onTheWay: boolean;
  started: boolean;
}) {
  const [work, setWork] = useState("");
  const [after, setAfter] = useState("");
  const [reason, setReason] = useState("");
  const [extraLabor, setExtraLabor] = useState("90");
  const [extraMats, setExtraMats] = useState("50");
  const [showChange, setShowChange] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    queryClient.invalidateQueries({ queryKey: ["messages"] });
  };

  const way = useMutation({
    mutationFn: () => markOnTheWay({ data: { jobId } }),
    onSuccess: () => {
      invalidate();
      toast.success("Homeowner notified — you are on the way");
    },
  });
  const start = useMutation({
    mutationFn: () => startJob({ data: { jobId } }),
    onSuccess: () => {
      invalidate();
      toast.success("Job started");
    },
  });
  const complete = useMutation({
    mutationFn: () =>
      markJobComplete({ data: { jobId, workPerformed: work, afterPhotoUrl: after } }),
    onSuccess: (res) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(
        res.autoConfirmed ? "Complete — payout released" : "Submitted. Waiting on confirmation.",
      );
    },
  });
  const change = useMutation({
    mutationFn: () =>
      requestChangeOrder({
        data: {
          jobId,
          reason,
          laborCents: Math.round(Number(extraLabor) * 100),
          materialsCents: Math.round(Number(extraMats) * 100),
        },
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Change order sent");
      setShowChange(false);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not request"),
  });

  return (
    <div className="mt-8 space-y-3">
      {!onTheWay ? (
        <Button className="w-full" size="lg" onClick={() => way.mutate()} disabled={way.isPending}>
          I'm on my way
        </Button>
      ) : !started ? (
        <Button className="w-full" size="lg" onClick={() => start.mutate()} disabled={start.isPending}>
          Start job
        </Button>
      ) : (
        <form
          className="space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            complete.mutate();
          }}
        >
          <h2 className="font-display text-lg font-semibold">Submit completion</h2>
          <div>
            <Label htmlFor="work">Work performed</Label>
            <Textarea
              id="work"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              placeholder="Replaced worn drain gasket and tightened the connection."
              required
            />
          </div>
          <div>
            <Label htmlFor="after">After photo (optional)</Label>
            <input
              id="after"
              type="file"
              accept="image/*"
              className="block w-full text-xs text-muted"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAfter(await fileToDataUrl(file));
              }}
            />
            {after ? (
              <img src={after} alt="" className="mt-2 h-28 w-full rounded-[12px] object-cover" />
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={complete.isPending}>
            <Check className="size-4" />
            {complete.isPending ? "Submitting…" : "Submit completion"}
          </Button>
        </form>
      )}

      {started ? (
        showChange ? (
          <form
            className="space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]"
            onSubmit={(e) => {
              e.preventDefault();
              change.mutate();
            }}
          >
            <h3 className="text-sm font-semibold">New issue discovered</h3>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Additional damaged pipe section found."
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Extra labor</Label>
                <Input value={extraLabor} onChange={(e) => setExtraLabor(e.target.value)} type="number" />
              </div>
              <div>
                <Label>Extra materials</Label>
                <Input value={extraMats} onChange={(e) => setExtraMats(e.target.value)} type="number" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={change.isPending}>
              Request customer approval
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setShowChange(false)}>
              Cancel additional work
            </Button>
          </form>
        ) : (
          <Button variant="secondary" className="w-full" onClick={() => setShowChange(true)}>
            Request additional work
          </Button>
        )
      ) : null}
    </div>
  );
}

function ChangeOrderCard({
  id,
  jobId,
  original,
  extra,
  reason,
}: {
  id: string;
  jobId: string;
  original: number;
  extra: number;
  reason: string;
}) {
  const mutate = useMutation({
    mutationFn: (approve: boolean) =>
      respondChangeOrder({ data: { changeOrderId: id, approve } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error("Add funds to cover the extra work");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(res.approved ? "Change approved" : "Change declined");
    },
  });
  return (
    <section className="mt-6 rounded-[20px] bg-warn/12 p-4">
      <h2 className="text-sm font-semibold">Additional work requested</h2>
      <p className="mt-1 text-sm text-muted">{reason}</p>
      <p className="mt-2 text-sm">
        Original {formatUsd(original)} · extra {formatUsd(extra)} · new total{" "}
        {formatUsd(original + extra)}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button onClick={() => mutate.mutate(true)} disabled={mutate.isPending}>
          Approve change
        </Button>
        <Button variant="secondary" onClick={() => mutate.mutate(false)} disabled={mutate.isPending}>
          Decline
        </Button>
      </div>
    </section>
  );
}

function ConfirmForm({
  jobId,
  proName,
  beforeUrl,
  afterUrl,
  work,
}: {
  jobId: string;
  proName: string;
  beforeUrl: string;
  afterUrl: string;
  work: string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>(["on_time", "quality"]);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState<string>(DISPUTE_REASONS[0].id);
  const [disputeDetails, setDisputeDetails] = useState("");

  const mutate = useMutation({
    mutationFn: () => confirmJobComplete({ data: { jobId, rating, comment, tags } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Confirmed — funds released");
    },
    onError: () => toast.error("Could not confirm"),
  });

  const dispute = useMutation({
    mutationFn: () =>
      openDispute({ data: { jobId, reason: disputeReason, details: disputeDetails } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      toast.success("Dispute opened — funds stay held");
      setDisputeOpen(false);
    },
  });

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-lg font-semibold">Is the job complete?</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <figure>
            <img src={beforeUrl} alt="Before" className="h-28 w-full rounded-[12px] object-cover" />
            <figcaption className="mt-1 text-xs text-subtle">Before</figcaption>
          </figure>
          <figure>
            {afterUrl ? (
              <img src={afterUrl} alt="After" className="h-28 w-full rounded-[12px] object-cover" />
            ) : (
              <div className="grid h-28 place-items-center rounded-[12px] bg-surface-2 text-xs text-muted">
                No after photo
              </div>
            )}
            <figcaption className="mt-1 text-xs text-subtle">After</figcaption>
          </figure>
        </div>
        {work ? <p className="mt-3 text-sm text-muted">{work}</p> : null}
      </div>

      <form
        className="space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]"
        onSubmit={(e) => {
          e.preventDefault();
          mutate.mutate();
        }}
      >
        <h2 className="font-display text-lg font-semibold">How was {proName}?</h2>
        <p className="text-sm text-muted">
          Looks good releases the hold to the pro, minus the 8% platform fee.
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={cn("p-1", n <= rating ? "text-warn" : "text-subtle")}
              aria-label={`${n} stars`}
            >
              <Star className={cn("size-6", n <= rating && "fill-warn")} />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {REVIEW_TAGS.map((t) => {
            const on = tags.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setTags((prev) => (on ? prev.filter((x) => x !== t.id) : [...prev, t.id]))
                }
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  on ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional written review"
        />
        <Button type="submit" className="w-full" disabled={mutate.isPending}>
          {mutate.isPending ? "Releasing…" : "Looks good — complete job"}
        </Button>
      </form>

      {disputeOpen ? (
        <form
          className="space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            dispute.mutate();
          }}
        >
          <h3 className="text-sm font-semibold">Report a problem</h3>
          <div className="flex flex-wrap gap-2">
            {DISPUTE_REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setDisputeReason(r.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  disputeReason === r.id
                    ? "bg-danger text-fg"
                    : "bg-surface-2 text-muted",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Textarea
            value={disputeDetails}
            onChange={(e) => setDisputeDetails(e.target.value)}
            placeholder="What happened?"
            required
          />
          <Button type="submit" variant="danger" className="w-full" disabled={dispute.isPending}>
            Open dispute
          </Button>
        </form>
      ) : (
        <Button variant="ghost" className="w-full" onClick={() => setDisputeOpen(true)}>
          <Shield className="size-4" />
          Report a problem
        </Button>
      )}
    </div>
  );
}

function CancelButton({ jobId }: { jobId: string }) {
  const mutate = useMutation({
    mutationFn: () => cancelJob({ data: { jobId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Job cancelled");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not cancel"),
  });
  return (
    <Button variant="ghost" size="sm" onClick={() => mutate.mutate()} disabled={mutate.isPending}>
      Cancel
    </Button>
  );
}
