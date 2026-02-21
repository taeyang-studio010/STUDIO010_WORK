"use client";

import { cn } from "@/lib/utils";

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-[var(--bg)]/95 px-4 backdrop-blur-md",
        "md:hidden"
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="flex min-h-[44px] min-w-[44px] -ml-2 items-center justify-center rounded-lg text-text-secondary hover:bg-white/5 hover:text-white"
        aria-label="메뉴 열기"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="text-lg font-semibold tracking-tight text-white">STUDIO 010</span>
    </header>
  );
}
