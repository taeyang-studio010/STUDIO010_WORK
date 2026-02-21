"use client";

import { useState, useEffect } from "react";
import type { BudgetProjectItem } from "@/features/budget/useBudget";
import { Modal } from "@/components/ui/Modal";

export function BudgetEntryModal({
  open,
  onClose,
  project,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  project: BudgetProjectItem | null;
  onSubmit: (payload: {
    budgetProjectId: string;
    amount: number;
    note?: string;
    spentAt?: string;
  }) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [spentAt, setSpentAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAmount("");
    setNote("");
    setSpentAt(new Date().toISOString().slice(0, 10));
    setError(null);
  }, [project, open]);

  if (!project) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setError(null);
    const num = parseInt(amount.replace(/\D/g, ""), 10) || 0;
    if (num <= 0) {
      setError("금액을 입력해 주세요.");
      return;
    }
    const { error: err } = await onSubmit({
      budgetProjectId: project.id,
      amount: num,
      note: note || undefined,
      spentAt,
    });
    if (err) {
      setError((err as Error).message ?? "저장 실패");
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`지출 등록 · ${project.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">금액 (원)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="숫자만 입력"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">지출일</label>
          <input
            type="date"
            value={spentAt}
            onChange={(e) => setSpentAt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">메모 (선택)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="용도 등"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/5"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "저장 중…" : "등록"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
