import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, ChevronRight, ImagePlus, Video } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { JobCard } from "@/components/job-card";
import { SeverityBadge } from "@/components/status";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyProfile, listMyDiagnoses, listMyJobs } from "@/lib/handypix-api";
import { formatUsd, relativeTime } from "@/lib/format";
import { HOME_CATEGORIES } from "@/lib/handypix-types";

export const Route = createFileRoute("/home")({ component: HomePage });

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  return (
    <AppShell>
      <HomeBody />
    </AppShell>
  );
}

function HomeBody() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => listMyJobs() });
  const diagnoses = useQuery({
    queryKey: ["diagnoses"],
    queryFn: () => listMyDiagnoses(),
  });

  if (profile.data?.role === "pro") return <Navigate to="/market" />;

  const openJobs = (jobs.data ?? []).filter(
    (j) => j.status !== "complete" && j.status !== "cancelled",
  );
  const first = profile.data?.displayName.split(" ")[0];

  return (
    <div>
      <p className="text-sm text-muted">
        {profile.data ? `${greeting()}, ${first}` : greeting()}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
        What's wrong?
      </h1>
      <p className="mt-1 text-sm text-muted">
        Take a picture and let HandyPix AI help.
      </p>

      <Link
        to="/scan"
        className="mt-6 flex items-center gap-4 rounded-[24px] bg-accent px-5 py-5 text-accent-fg"
      >
        <span className="grid size-12 place-items-center rounded-full bg-accent-fg/15">
          <Camera className="size-6" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-lg font-semibold">Take a photo</span>
          <span className="block text-sm opacity-80">
            Close-up plus a wider shot works best
          </span>
        </span>
        <ChevronRight className="size-5 opacity-70" />
      </Link>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Link
          to="/scan"
          search={{ mode: "upload" }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-[16px] bg-surface text-sm shadow-[var(--shadow-border)]"
        >
          <ImagePlus className="size-4" />
          Upload
        </Link>
        <Link
          to="/scan"
          search={{ mode: "video" }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-[16px] bg-surface text-sm shadow-[var(--shadow-border)]"
        >
          <Video className="size-4" />
          Video
        </Link>
        <Link
          to="/jobs"
          className="flex min-h-12 items-center justify-center rounded-[16px] bg-surface text-sm shadow-[var(--shadow-border)]"
        >
          My jobs
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Trades</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {HOME_CATEGORIES.map((c) => (
            <Link
              key={c.label}
              to="/scan"
              search={{ category: c.id }}
              className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-fg"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-lg font-semibold">Active jobs</h2>
          <Link to="/jobs" className="text-sm text-muted hover:text-fg">
            All
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {jobs.isPending ? (
            <Skeleton className="h-28 w-full rounded-[22px]" />
          ) : openJobs.length === 0 ? (
            <p className="rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]">
              No open jobs yet. Snap a problem to post one.
            </p>
          ) : (
            openJobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} href="/jobs/$id" />)
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Recent diagnoses</h2>
        <div className="mt-3 space-y-2">
          {diagnoses.isPending ? (
            <Skeleton className="h-16 w-full" />
          ) : (diagnoses.data ?? []).length === 0 ? (
            <p className="text-sm text-muted">Nothing scanned yet.</p>
          ) : (
            diagnoses.data!.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                to="/diagnosis/$id"
                params={{ id: d.id }}
                className="flex items-center gap-3 rounded-[18px] bg-surface p-2 shadow-[var(--shadow-border)]"
              >
                <img
                  src={d.photoUrl}
                  alt=""
                  className="size-14 rounded-[12px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.result.issue}</p>
                  <p className="text-xs text-muted">
                    {formatUsd(d.result.est_cost_min_cents)}–{formatUsd(d.result.est_cost_max_cents)}{" "}
                    · {relativeTime(d.createdAt)}
                  </p>
                </div>
                <SeverityBadge value={d.result.severity} />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
