"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { KpiScope } from "@/lib/supabase/database.types";
import { useKpi } from "@/features/kpi/useKpi";
import { KpiItemModal } from "@/components/KpiItemModal";

interface KpiBlockProps {
  title: string;
  scope: KpiScope;
}

function CircularProgress({ percent }: { percent: number }) {
  const size = 120;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#00ff88"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-xl font-semibold text-white">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

export function KpiBlock({ title, scope }: KpiBlockProps) {
  const { kpis, progress, toggleGoal, addItem, updateItem, removeItem } = useKpi();
  const goals = kpis[scope];
  const percent = progress[scope];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const handleSubmit = async (label: string) => {
    if (editingId) return updateItem(editingId, label);
    return addItem(scope, label);
  };

  return (
    <div className="glass-panel-strong flex flex-col rounded-xl border border-border p-5 transition-fluid sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setEditingLabel("");
              setModalOpen(true);
            }}
            className="rounded bg-accent/20 px-2 py-1 text-xs text-accent hover:bg-accent/30"
          >
            + 항목
          </button>
        </div>
        <ul className="space-y-2">
          {goals.map((goal) => (
            <label
              key={goal.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-white/[0.03] px-3 py-2 transition-fluid hover:bg-white/[0.06]",
                goal.checked && "border-accent/30 bg-accent-dim/20"
              )}
            >
              <input
                type="checkbox"
                checked={goal.checked}
                onChange={() => toggleGoal(scope, goal.id)}
                className="h-4 w-4 shrink-0 rounded border-border bg-white/5 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <span
                className={cn("flex-1 text-sm text-white", goal.checked && "text-text-tertiary line-through")}
              >
                {goal.label}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditingId(goal.id);
                  setEditingLabel(goal.label);
                  setModalOpen(true);
                }}
                className="shrink-0 rounded p-1 text-xs text-text-tertiary hover:bg-white/10 hover:text-white"
              >
                편집
              </button>
            </label>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-center border-t border-border pt-4 sm:mt-0 sm:shrink-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <CircularProgress percent={percent} />
      </div>
      <KpiItemModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingId(null); }}
        scope={scope}
        initialLabel={editingLabel}
        itemId={editingId}
        onSubmit={handleSubmit}
        onDelete={editingId ? removeItem : undefined}
      />
    </div>
  );
}
