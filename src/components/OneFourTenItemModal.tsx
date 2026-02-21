"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import type { OneFourTenItem } from "@/features/oneFourTen/useOneFourTen";

export function OneFourTenItemModal({
  open,
  onClose,
  item,
  onSubmit,
  onDelete,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  item: OneFourTenItem | null;
  onSubmit: (payload: { step: string; title: string; description?: string }) => Promise<{ error: unknown }>;
  onDelete?: (id: string) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const isEdit = !!item;
  const [step, setStep] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setStep(item.step);
      setTitle(item.title);
      setDescription(item.description ?? "");
    } else {
      setStep("");
      setTitle("");
      setDescription("");
    }
    setError(null);
  }, [item, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await onSubmit({ step, title, description: description || undefined });
    if (err) {
      setError((err as Error).message ?? "저장 실패");
      return;
    }
    onClose();
  }

  async function handleDelete() {
    if (!item || !onDelete) return;
    const { error: err } = await onDelete(item.id);
    if (err) setError((err as Error).message ?? "삭제 실패");
    else onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "1/4/10 항목 수정" : "1/4/10 항목 추가"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">단계 (숫자)</label>
          <input type="text" value={step} onChange={(e) => setStep(e.target.value)} required className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" placeholder="1, 4, 10" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">설명 (선택)</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2 pt-2">
          {isEdit && onDelete && <button type="button" onClick={handleDelete} disabled={loading} className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">삭제</button>}
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/5">취소</button>
          <button type="submit" disabled={loading} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90 disabled:opacity-50">{isEdit ? "수정" : "추가"}</button>
        </div>
      </form>
    </Modal>
  );
}
