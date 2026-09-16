import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  ClipboardList,
  Home,
  LayoutGrid,
  MessageSquare,
  UserRound,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton, RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/handypix-api";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/handypix-types";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
  });

  if (isPending) return <ShellSkeleton />;
  if (!user) return <RedirectToSignIn />;
  if (profileQuery.isPending) return <ShellSkeleton />;
  if (!profileQuery.data) return <Navigate to="/onboarding" />;

  return <ShellFrame profile={profileQuery.data}>{children}</ShellFrame>;
}

function ShellFrame({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navFor(profile.role);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-bg px-4 py-5 md:flex">
        <Link to="/home" className="px-1">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <NavLink key={item.to} item={item} pathname={pathname} />
          ))}
        </nav>
        <Link
          to="/blueprint"
          className="rounded-[12px] px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-fg"
        >
          Product blueprint
        </Link>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur-sm">
          <Link to="/home" className="md:hidden">
            <Logo markClassName="size-7" />
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/wallet"
              className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium tabular-nums text-fg shadow-[var(--shadow-border)]"
            >
              {formatUsd(profile.walletCents)}
            </Link>
            <UserButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 md:pb-12">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {items.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px]",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

type NavItem = {
  to: "/home" | "/jobs" | "/wallet" | "/market" | "/bids" | "/profile" | "/messages";
  label: string;
  icon: typeof Home;
};

function navFor(role: Profile["role"]): NavItem[] {
  if (role === "pro") {
    return [
      { to: "/market", label: "Jobs", icon: LayoutGrid },
      { to: "/bids", label: "Bids", icon: ClipboardList },
      { to: "/messages", label: "Messages", icon: MessageSquare },
      { to: "/wallet", label: "Earnings", icon: Wallet },
      { to: "/profile", label: "Profile", icon: UserRound },
    ];
  }
  return [
    { to: "/home", label: "Home", icon: Home },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/messages", label: "Messages", icon: MessageSquare },
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/profile", label: "Profile", icon: UserRound },
  ];
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isActive(pathname, item.to);
  return (
    <Link
      to={item.to}
      className={cn(
        "flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium",
        active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface hover:text-fg",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/home") return pathname === "/home" || pathname === "/scan";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function ShellSkeleton() {
  return (
    <div className="min-h-dvh bg-bg p-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-8 h-40 w-full rounded-[22px]" />
      <Skeleton className="mt-4 h-24 w-full rounded-[22px]" />
    </div>
  );
}
