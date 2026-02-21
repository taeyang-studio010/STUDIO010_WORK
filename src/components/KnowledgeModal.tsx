"use client";

import { useState, useEffect } from "react";
import type { KnowledgeItem } from "@/features/storage/useStorage";
import { Modal } from "@/components/ui/Modal";

const TYPES: { value: KnowledgeItem["type"]; label: string }[] = [
  { value: "reference", label: "시장 조사" },
  { value: "webinar", label: "웨비나" },
  { value: "meeting", label: "회의록" },
];

export function KnowledgeModal({
  open,
  onClose,
  item,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  item: KnowledgeItem | null;
  onSubmit: (payload: {
    title: string;
    type: KnowledgeItem["type"];
    description?: string;
    link?: string;
    date?: string;
  }) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const isEdit = !!item;
  const [title, setTitle] = useState("");
  const [type, setType] = useState<KnowledgeItem["type"]>("reference");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setType(item.type);
      setDescription(item.description ?? "");
      setLink(item.link ?? "");
      setDate(item.date ?? "");
    } else {
      setTitle("");
      setType("reference");
      setDescription("");
      setLink("");
      setDate("");
    }
    setError(null);
  }, [item, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await onSubmit({
      title,
      type,
      description: description || undefined,
      link: link || undefined,
      date: date || undefined,
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
      title={isEdit ? "지식 수정" : "지식 추가"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="제목"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">유형</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as KnowledgeItem["type"])}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">설명 (선택)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">링크 (선택)</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">날짜 (선택)</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
            {loading ? "저장 중…" : isEdit ? "수정" : "추가"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
