import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listMessages, listThreads, sendMessage } from "@/lib/handypix-api";
import { relativeTime } from "@/lib/format";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    job: typeof search.job === "string" ? search.job : undefined,
  }),
});

function MessagesPage() {
  return (
    <AppShell>
      <MessagesBody />
    </AppShell>
  );
}

function MessagesBody() {
  const { job: jobFromSearch } = Route.useSearch();
  const threads = useQuery({ queryKey: ["messages"], queryFn: () => listThreads() });
  const [active, setActive] = useState<string | undefined>(jobFromSearch);

  const current = active ?? jobFromSearch ?? threads.data?.[0]?.jobId;

  if (threads.isPending) return <Skeleton className="h-64 w-full rounded-[24px]" />;

  if (!threads.data?.length) {
    return (
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-4 rounded-[20px] bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]">
          Threads open after you hire a pro. Phone numbers stay hidden.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Messages</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
        <ul className="space-y-2">
          {threads.data.map((t) => (
            <li key={t.jobId}>
              <button
                type="button"
                onClick={() => setActive(t.jobId)}
                className={cn(
                  "w-full rounded-[16px] p-3 text-left shadow-[var(--shadow-border)]",
                  current === t.jobId ? "bg-surface-2" : "bg-surface",
                )}
              >
                <p className="truncate text-sm font-medium">{t.otherName}</p>
                <p className="truncate text-xs text-muted">{t.title}</p>
                <p className="mt-1 truncate text-xs text-subtle">{t.lastBody}</p>
              </button>
            </li>
          ))}
        </ul>
        {current ? <Thread jobId={current} /> : null}
      </div>
    </div>
  );
}

function Thread({ jobId }: { jobId: string }) {
  const messages = useQuery({
    queryKey: ["thread", jobId],
    queryFn: () => listMessages({ data: jobId }),
  });
  const [body, setBody] = useState("");
  const send = useMutation({
    mutationFn: () => sendMessage({ data: { jobId, body } }),
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["thread", jobId] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send"),
  });

  return (
    <div className="rounded-[22px] bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">In-app thread</p>
        <Link to="/jobs/$id" params={{ id: jobId }} className="text-xs text-accent">
          Open job
        </Link>
      </div>
      <div className="max-h-80 space-y-3 overflow-y-auto">
        {messages.isPending ? (
          <Skeleton className="h-20 w-full" />
        ) : (messages.data ?? []).length === 0 ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          messages.data!.map((m) => (
            <div key={m.id} className={cn("max-w-[85%]", m.mine && "ml-auto")}>
              <p className="text-[11px] text-subtle">
                {m.fromName} · {relativeTime(m.createdAt)}
              </p>
              <p
                className={cn(
                  "mt-1 rounded-[14px] px-3 py-2 text-sm",
                  m.mine ? "bg-accent text-accent-fg" : "bg-surface-2",
                )}
              >
                {m.body}
              </p>
            </div>
          ))
        )}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim()) send.mutate();
        }}
      >
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Message — numbers stay masked"
        />
        <Button type="submit" disabled={send.isPending}>
          Send
        </Button>
      </form>
    </div>
  );
}
