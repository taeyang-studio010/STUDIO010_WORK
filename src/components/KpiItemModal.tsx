"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import type { KpiScope } from "@/lib/supabase/database.types";

export function KpiItemModal({
  open,
  onClose,
  scope,
  initialLabel,
  itemId,
  onSubmit,
  onDelete,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  scope: KpiScope;
  initialLabel: string;
  itemId: string | null;
  onSubmit: (label: string) => Promise<{ error: unknown }>;
  onDelete?: (id: string) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!itemId;

  useEffect(() => {
    setLabel(initialLabel);
    setError(null);
  }, [initialLabel, itemId, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await onSubmit(label.trim());
    if (err) {
      setError((err as Error).message ?? "저장 실패");
      return;
    }
    onClose();
  }

  async function handleDelete() {
    if (!itemId || !onDelete) return;
    setError(null);
    const { error: err } = await onDelete(itemId);
    if (err) {
      setError((err as Error).message ?? "삭제 실패");
      return;
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "KPI 항목 수정" : "KPI 항목 추가"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">범위</label>
          <p className="mt-1 text-sm text-white">
            {scope === "main" ? "메인" : scope === "monthly" ? "월간" : "주간"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">항목 내용</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="예: 분기 매출 목표 달성"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2 pt-2">
          {isEdit && onDelete && (
            <button type="button" onClick={handleDelete} disabled={loading} className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
              삭제
            </button>
          )}
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/5">
            취소
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90 disabled:opacity-50">
            {isEdit ? "수정" : "추가"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
