"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/nav";
import { ExecInvitePanel } from "@/components/ExecInvitePanel";
import { useAuth } from "@/features/auth/useAuth";

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[280px] max-w-[85vw] flex flex-col",
          "glass-panel-strong border-0 border-r border-border",
          "transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-lg font-semibold tracking-tight text-white">STUDIO 010</span>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-text-secondary hover:bg-white/5 hover:text-white"
            aria-label="메뉴 닫기"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-fluid",
                  "hover:bg-white/5 hover:text-white",
                  isActive ? "bg-white/5 text-white" : "text-text-secondary"
                )}
              >
                <span className="text-accent opacity-80" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="rounded-lg bg-accent-dim/30 px-3 py-2 text-xs text-accent">
            <span className="font-medium">Track A</span> STUDIO 010 ·{" "}
            <span className="font-medium">Track B</span> Let&apos;s Comfy
          </div>
          <div className="mt-3">
            <AuthBlock onClose={onClose} />
          </div>
          <div className="mt-3">
            <ExecInvitePanel />
          </div>
        </div>
      </aside>
    </>
  );
}

function AuthBlock({ onClose }: { onClose: () => void }) {
  const { user, loading, signOut } = useAuth();
  if (loading) return null;
  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <p className="truncate text-xs text-text-secondary" title={user.email ?? undefined}>
          {user.email}
        </p>
        <button
          type="button"
          onClick={() => { signOut(); onClose(); }}
          className="min-h-[44px] rounded-lg border border-border px-3 py-2 text-left text-sm text-text-secondary hover:bg-white/5 hover:text-white"
        >
          로그아웃
        </button>
      </div>
    );
  }
  return (
    <Link
      href="/login"
      onClick={onClose}
      className="flex min-h-[44px] items-center justify-center rounded-lg border border-accent/50 text-sm text-accent hover:bg-accent-dim/30"
    >
      로그인
    </Link>
  );
}
