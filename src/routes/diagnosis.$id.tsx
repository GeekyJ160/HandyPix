import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { DiagnosisReport } from "@/components/diagnosis-report";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  confirmDiagnosis,
  getDiagnosis,
  getMyProfile,
  postJobFromDiagnosis,
} from "@/lib/handypix-api";
import {
  BUDGET_BAND_LABEL,
  BUDGET_BANDS,
  TIME_WINDOW_LABEL,
  TIME_WINDOWS,
  URGENCIES,
  URGENCY_LABEL,
  type BudgetBand,
  type TimeWindow,
  type Urgency,
} from "@/lib/handypix-types";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diagnosis/$id")({
  component: DiagnosisPage,
});

function DiagnosisPage() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <DiagnosisBody id={id} />
    </AppShell>
  );
}

function DiagnosisBody({ id }: { id: string }) {
  const navigate = useNavigate();
  const dx = useQuery({
    queryKey: ["diagnosis", id],
    queryFn: () => getDiagnosis({ data: id }),
  });
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const [step, setStep] = useState<"report" | "post">("report");
  const [answer, setAnswer] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zip, setZip] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("soon");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("flexible");
  const [budgetBand, setBudgetBand] = useState<BudgetBand>("unknown");
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });

  useEffect(() => {
    const result = dx.data?.result;
    if (!result) return;
    setTitle((t) => t || result.issue);
    setDescription((d) => {
      if (d) return d;
      const extra = result.follow_up_answer
        ? `\n\nHomeowner: ${result.follow_up_question} ${result.follow_up_answer}.`
        : "";
      return `${result.summary}${extra}`;
    });
    setAnswer((a) => a || result.follow_up_answer);
  }, [dx.data]);

  const saveAnswer = useMutation({
    mutationFn: () => confirmDiagnosis({ data: { diagnosisId: id, answer } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis", id] });
    },
  });

  const post = useMutation({
    mutationFn: () =>
      postJobFromDiagnosis({
        data: {
          diagnosisId: id,
          zip: zip || profile.data?.zip || "75201",
          urgency,
          title,
          description,
          preferredDate,
          timeWindow,
          budgetBand,
        },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
      toast.success("Job posted — local pros are bidding");
      void navigate({ to: "/jobs/$id", params: { id: res.jobId } });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not post this job"),
  });

  if (dx.isPending) {
    return <Skeleton className="h-80 w-full rounded-[24px]" />;
  }
  if (!dx.data) {
    return <p className="text-sm text-muted">Diagnosis not found.</p>;
  }

  const row = dx.data;
  const danger = row.result.safety_level === "danger";

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto">
        {row.photoUrls.map((src, i) => (
          <img
            key={`${row.id}-${i}`}
            src={src}
            alt=""
            className="h-52 w-full min-w-[70%] rounded-[24px] object-cover sm:h-64"
          />
        ))}
      </div>
      <div className="mt-6">
        <DiagnosisReport result={row.result} />
      </div>

      {row.jobId ? (
        <Button asChild className="mt-8 w-full" size="lg">
          <Link to="/jobs/$id" params={{ id: row.jobId }}>
            View posted job
          </Link>
        </Button>
      ) : step === "report" ? (
        <div className="mt-8 space-y-4">
          {row.result.follow_up_question ? (
            <section className="rounded-[20px] bg-surface p-4 shadow-[var(--shadow-border)]">
              <h3 className="text-sm font-semibold">{row.result.follow_up_question}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {row.result.follow_up_options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setAnswer(opt);
                      void confirmDiagnosis({ data: { diagnosisId: id, answer: opt } });
                    }}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      answer === opt
                        ? "bg-accent text-accent-fg"
                        : "bg-surface-2 text-muted",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {danger ? (
            <p className="text-sm text-muted">
              Bidding is paused on dangerous issues. Get a professional on site — or
              emergency services — before using HandyPix as a marketplace.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (answer) saveAnswer.mutate();
                  setStep("post");
                }}
              >
                Looks right
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link to="/scan">Something else</Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <form
          className="mt-8 space-y-3 rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            post.mutate();
          }}
        >
          <h2 className="font-display text-lg font-semibold">Let's get this posted</h2>
          {row.result.safety_level === "caution" ? (
            <p className="text-xs text-warn">
              A professional should inspect this before repair. Bids are for that
              inspection and the work that follows.
            </p>
          ) : null}
          <div>
            <Label htmlFor="title">Problem</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="zip">ZIP — address stays hidden until you hire</Label>
            <Input
              id="zip"
              value={zip || profile.data?.zip || ""}
              onChange={(e) => setZip(e.target.value)}
              placeholder="75201"
            />
          </div>
          <div>
            <Label htmlFor="date">Preferred date</Label>
            <Input
              id="date"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Time of day</Label>
            <div className="flex flex-wrap gap-2">
              {TIME_WINDOWS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setTimeWindow(w)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    timeWindow === w ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {TIME_WINDOW_LABEL[w]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>When do you need it?</Label>
            <div className="flex flex-wrap gap-2">
              {URGENCIES.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    urgency === u ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {URGENCY_LABEL[u]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Budget (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_BANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetBand(b)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    budgetBand === b ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {BUDGET_BAND_LABEL[b]}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={post.isPending}>
            {post.isPending ? "Posting…" : "Get local bids"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("report")}>
            Back
          </Button>
        </form>
      )}
    </div>
  );
}
