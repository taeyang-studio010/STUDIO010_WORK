"use client";

import Link from "next/link";
import { useKanban } from "@/features/tasks/useKanban";

export function TaskSummaryWidget() {
  const { tasks } = useKanban();
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const review = tasks.filter((t) => t.status === "review").length;
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <Link
      href="/tasks"
      className="glass-panel flex w-full min-h-full flex-col justify-between rounded-xl border border-border p-6 transition-fluid hover-lift hover:border-border-strong"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">
          업무 현황
        </span>
        <span className="text-xs text-accent">칸반 보기 →</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="rounded-lg bg-white/5 py-2">
          <p className="text-lg font-semibold text-white">{todo}</p>
          <p className="text-xs text-text-tertiary">To Do</p>
        </div>
        <div className="rounded-lg bg-blue-500/10 py-2">
          <p className="text-lg font-semibold text-blue-300">{inProgress}</p>
          <p className="text-xs text-text-tertiary">진행 중</p>
        </div>
        <div className="rounded-lg bg-amber-500/10 py-2">
          <p className="text-lg font-semibold text-amber-300">{review}</p>
          <p className="text-xs text-text-tertiary">Review</p>
        </div>
        <div className="rounded-lg bg-accent/10 py-2">
          <p className="text-lg font-semibold text-accent">{done}</p>
          <p className="text-xs text-text-tertiary">Done</p>
        </div>
      </div>
    </Link>
  );
}
