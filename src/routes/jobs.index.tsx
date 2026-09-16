import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listMyJobs } from "@/lib/handypix-api";

export const Route = createFileRoute("/jobs/")({ component: JobsPage });

function JobsPage() {
  return (
    <AppShell>
      <JobsBody />
    </AppShell>
  );
}

function JobsBody() {
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => listMyJobs() });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your jobs</h1>
      <p className="mt-1 text-sm text-muted">Open listings, hired work, and history.</p>
      <div className="mt-6 space-y-3">
        {jobs.isPending ? (
          <>
            <Skeleton className="h-28 w-full rounded-[22px]" />
            <Skeleton className="h-28 w-full rounded-[22px]" />
          </>
        ) : (jobs.data ?? []).length === 0 ? (
          <div className="rounded-[22px] bg-surface p-6 text-center shadow-[var(--shadow-border)]">
            <p className="text-sm text-muted">You have not posted a job yet.</p>
            <Button asChild className="mt-4">
              <Link to="/scan">Snap a problem</Link>
            </Button>
          </div>
        ) : (
          jobs.data!.map((job) => <JobCard key={job.id} job={job} href="/jobs/$id" />)
        )}
      </div>
    </div>
  );
}
