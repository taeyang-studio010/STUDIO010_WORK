"use client";

import Link from "next/link";
import { useBudget } from "@/features/budget/useBudget";

function formatWon(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString();
}

export function BudgetSummaryWidget() {
  const { totalBudget, totalSpent } = useBudget();
  const pct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  return (
    <Link
      href="/budget"
      className="glass-panel flex w-full min-h-full flex-col justify-between rounded-xl border border-border p-6 transition-fluid hover-lift hover:border-border-strong"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">
          예산 요약
        </span>
        <span className="text-xs text-accent">전체 보기 →</span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-white">
          {formatWon(totalSpent)} / {formatWon(totalBudget)}
        </p>
        <p className="mt-1 text-xs text-text-tertiary">전체 지출 / 예산</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
