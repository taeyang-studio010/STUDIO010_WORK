"use client";

import { useState, useEffect } from "react";
import type { BudgetProjectItem } from "@/features/budget/useBudget";
import { Modal } from "@/components/ui/Modal";

export function BudgetProjectModal({
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
    name: string;
    total: number;
    isGovernment?: boolean;
  }) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const isEdit = !!project;
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [isGovernment, setIsGovernment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setTotal(String(project.total));
      setIsGovernment(project.isGovernment ?? false);
    } else {
      setName("");
      setTotal("");
      setIsGovernment(false);
    }
    setError(null);
  }, [project, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const num = parseInt(total.replace(/\D/g, ""), 10) || 0;
    if (num < 0) {
      setError("예산은 0 이상이어야 합니다.");
      return;
    }
    const { error: err } = await onSubmit({ name, total: num, isGovernment });
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
      title={isEdit ? "프로젝트 수정" : "프로젝트 추가"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">프로젝트명</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="예: 1차 런칭"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">총 예산 (원)</label>
          <input
            type="text"
            value={total}
            onChange={(e) => setTotal(e.target.value.replace(/\D/g, ""))}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="숫자만 입력"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={isGovernment}
            onChange={(e) => setIsGovernment(e.target.checked)}
            className="rounded border-border bg-white/5 text-accent focus:ring-accent"
          />
          정부지원금
        </label>
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
            {loading ? "저장 중…" : isEdit ? "수정" : "추가"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
