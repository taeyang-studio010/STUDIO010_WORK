"use client";

import { useState, useEffect } from "react";
import type { AssetItem } from "@/features/storage/useStorage";
import { Modal } from "@/components/ui/Modal";

const TYPES: { value: AssetItem["type"]; label: string }[] = [
  { value: "logo", label: "로고" },
  { value: "color", label: "컬러" },
  { value: "font", label: "폰트" },
  { value: "document", label: "문서" },
];

export function AssetModal({
  open,
  onClose,
  item,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  item: AssetItem | null;
  onSubmit: (payload: {
    name: string;
    type: AssetItem["type"];
    value?: string;
    description?: string;
  }) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const isEdit = !!item;
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetItem["type"]>("logo");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setType(item.type);
      setValue(item.value ?? "");
      setDescription(item.description ?? "");
    } else {
      setName("");
      setType("logo");
      setValue("");
      setDescription("");
    }
    setError(null);
  }, [item, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await onSubmit({
      name,
      type,
      value: value || undefined,
      description: description || undefined,
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
      title={isEdit ? "에셋 수정" : "에셋 추가"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="예: 메인 로고"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">유형</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AssetItem["type"])}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">
            값 (선택, 컬러는 #hex 등)
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="#00ff88 또는 URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">설명 (선택)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
