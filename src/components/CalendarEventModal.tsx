"use client";

import { useState, useEffect } from "react";
import type { CalendarEventItem } from "@/features/calendar/useCalendar";
import { Modal } from "@/components/ui/Modal";

const TYPES: { value: CalendarEventItem["type"]; label: string }[] = [
  { value: "regular", label: "일정" },
  { value: "meeting", label: "회의" },
  { value: "milestone", label: "마일스톤" },
  { value: "deadline", label: "마감" },
];

export function CalendarEventModal({
  open,
  onClose,
  event,
  initialDate,
  onSubmit,
  onDelete,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  event: CalendarEventItem | null;
  initialDate?: string;
  onSubmit: (payload: {
    title: string;
    date: string;
    type?: CalendarEventItem["type"];
    description?: string;
    allDay?: boolean;
  }) => Promise<{ error: unknown }>;
  onDelete?: (eventId: string) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const isEdit = !!event;
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<CalendarEventItem["type"]>("regular");
  const [description, setDescription] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setType(event.type);
      setDescription(event.description ?? "");
      setAllDay(event.allDay ?? true);
    } else {
      setTitle("");
      setDate(initialDate ?? new Date().toISOString().slice(0, 10));
      setType("regular");
      setDescription("");
      setAllDay(true);
    }
    setError(null);
  }, [event, initialDate, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await onSubmit({
      title,
      date,
      type,
      description: description || undefined,
      allDay,
    });
    if (err) {
      setError((err as Error).message ?? "저장 실패");
      return;
    }
    onClose();
  }

  async function handleDelete() {
    if (!event || !onDelete) return;
    setError(null);
    const { error: err } = await onDelete(event.id);
    if (err) {
      setError((err as Error).message ?? "삭제 실패");
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "일정 수정" : "일정 추가"}
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
            placeholder="일정 제목"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">유형</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CalendarEventItem["type"])}
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
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="rounded border-border bg-white/5 text-accent focus:ring-accent"
          />
          종일
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex flex-wrap gap-2 pt-2">
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              삭제
            </button>
          )}
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
