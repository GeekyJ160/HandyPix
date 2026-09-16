import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="10.6" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 6.8 20.1 13.5 16 16 11.9 13.5Z" fill="currentColor" />
      <path d="M25.2 16 18.5 20.1 16 16 18.5 11.9Z" fill="currentColor" opacity=".82" />
      <path d="M16 25.2 11.9 18.5 16 16 20.1 18.5Z" fill="currentColor" opacity=".52" />
      <path d="M6.8 16 13.5 11.9 16 16 13.5 20.1Z" fill="currentColor" opacity=".82" />
      <circle cx="16" cy="16" r="3" fill="var(--color-bg)" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      <rect x="2" y="9.5" width="4.4" height="2.1" fill="currentColor" />
      <rect x="25.6" y="20.4" width="4.4" height="2.1" fill="currentColor" />
      <rect x="9.5" y="2" width="2.1" height="4.4" fill="currentColor" />
      <rect x="20.4" y="25.6" width="2.1" height="4.4" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  wordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("size-8", markClassName)} />
      {wordmark ? (
        <span className="font-display text-[1.05rem] font-semibold tracking-tight text-fg">
          HandyPix <span className="text-accent">AI</span>
        </span>
      ) : null}
    </span>
  );
}
