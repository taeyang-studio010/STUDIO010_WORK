"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/nav";
import { ExecInvitePanel } from "@/components/ExecInvitePanel";
import { useAuth } from "@/features/auth/useAuth";

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[240px] shrink-0",
        "glass-panel-strong border-0 border-r border-border",
        "flex flex-col transition-fluid",
        "max-md:hidden",
        "max-lg:w-[72px] max-lg:items-center max-lg:px-0"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-5 max-lg:justify-center max-lg:px-0">
        <span className="text-lg font-semibold tracking-tight text-white max-lg:text-sm">
          STUDIO 010
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-fluid",
                "hover:bg-white/5 hover:text-white",
                "max-lg:justify-center max-lg:px-2",
                isActive ? "bg-white/5 text-white" : "text-text-secondary"
              )}
            >
              <span className="text-accent opacity-80" aria-hidden>
                {item.icon}
              </span>
              <span className="max-lg:sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Track labels (collapsed on mobile) */}
      <div className="border-t border-border p-3 max-lg:px-2">
        <div className="rounded-lg bg-accent-dim/30 px-3 py-2 text-xs text-accent max-lg:sr-only">
          <span className="font-medium">Track A</span> STUDIO 010 ·{" "}
          <span className="font-medium">Track B</span> Let&apos;s Comfy
        </div>
        {!loading && (
          <div className="mt-3">
            {user ? (
              <div className="flex flex-col gap-2 max-lg:items-center">
                <p className="truncate text-xs text-text-secondary max-lg:max-w-[56px] max-lg:truncate" title={user.email ?? undefined}>
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 hover:text-white max-lg:w-full"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block rounded-lg border border-accent/50 px-3 py-2 text-center text-xs text-accent hover:bg-accent-dim/30"
              >
                로그인
              </Link>
            )}
          </div>
        )}
        <div className="mt-3">
          <ExecInvitePanel />
        </div>
      </div>
    </aside>
  );
}
