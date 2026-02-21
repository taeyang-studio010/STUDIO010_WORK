"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useBudget, type BudgetProjectItem } from "@/features/budget/useBudget";
import { BudgetProjectModal } from "@/components/BudgetProjectModal";
import { BudgetEntryModal } from "@/components/BudgetEntryModal";

function formatWon(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString();
}

export function BudgetTracker() {
  const {
    projects,
    createProject,
    updateProject,
    addEntry,
  } = useBudget();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<BudgetProjectItem | null>(null);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entryProject, setEntryProject] = useState<BudgetProjectItem | null>(null);

  const handleProjectSubmit = async (payload: {
    name: string;
    total: number;
    isGovernment?: boolean;
  }) => {
    if (editingProject) {
      return updateProject(editingProject.id, payload);
    }
    const { error } = await createProject(payload);
    return { error };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setProjectModalOpen(true);
          }}
          className="min-h-[44px] rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90"
        >
          프로젝트 추가
        </button>
      </div>
      <div className="glass-panel rounded-xl border border-border p-4 transition-fluid">
        <h3 className="mb-4 text-sm font-medium text-text-secondary">
          프로젝트별 예산 · 지출 현황
        </h3>
        <ul className="space-y-4">
          {projects.map((p) => {
            const pct = Math.min(100, p.total ? (p.spent / p.total) * 100 : 0);
            return (
              <li
                key={p.id}
                className={cn(
                  "rounded-lg border border-border bg-white/[0.03] p-4 transition-fluid hover:bg-white/[0.05]"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="font-medium text-white cursor-pointer hover:text-accent"
                    onClick={() => {
                      setEditingProject(p);
                      setProjectModalOpen(true);
                    }}
                  >
                    {p.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEntryProject(p);
                        setEntryModalOpen(true);
                      }}
                      className="min-h-[44px] rounded bg-white/10 px-3 py-2 text-xs text-text-secondary hover:bg-white/15 hover:text-white"
                    >
                      지출 등록
                    </button>
                    {p.isGovernment && (
                      <span className="rounded bg-accent/20 px-2 py-0.5 text-xs text-accent">
                        정부지원금
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-1 flex justify-between text-xs text-text-tertiary">
                  <span>지출 {formatWon(p.spent)} / {formatWon(p.total)}</span>
                  <span>{pct.toFixed(0)}% 소진</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      p.isGovernment ? "bg-accent" : "bg-blue-500/80"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <BudgetProjectModal
        open={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSubmit={handleProjectSubmit}
      />
      <BudgetEntryModal
        open={entryModalOpen}
        onClose={() => {
          setEntryModalOpen(false);
          setEntryProject(null);
        }}
        project={entryProject}
        onSubmit={async (p) => addEntry(p)}
      />
    </div>
  );
}
