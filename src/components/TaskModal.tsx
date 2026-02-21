"use client";

import { useState, useEffect } from "react";
import type { TaskStatus, TrackId } from "@/types/task";
import type { KanbanTask } from "@/features/tasks/useKanban";
import { Modal } from "@/components/ui/Modal";

const TRACKS: { id: TrackId; label: string }[] = [
  { id: "studio010", label: "STUDIO 010" },
  { id: "letscomfy", label: "Let's Comfy" },
];
const STATUSES: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To Do" },
  { status: "in_progress", label: "In Progress" },
  { status: "review", label: "Review" },
  { status: "done", label: "Done" },
];

export function TaskModal({
  open,
  onClose,
  task,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  task: KanbanTask | null;
  onSubmit: (payload: {
    track: TrackId;
    title: string;
    description?: string;
    assignee?: string;
    status?: TaskStatus;
  }) => Promise<{ error: unknown }>;
  loading?: boolean;
}) {
  const isEdit = !!task;
  const [track, setTrack] = useState<TrackId>("studio010");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTrack(task.track);
      setTitle(task.title);
      setDescription(task.description ?? "");
      setAssignee(task.assignee ?? "");
      setStatus(task.status);
    } else {
      setTrack("studio010");
      setTitle("");
      setDescription("");
      setAssignee("");
      setStatus("todo");
    }
    setError(null);
  }, [task, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      track,
      title,
      description: description || undefined,
      assignee: assignee || undefined,
      ...(isEdit ? { status } : {}),
    };
    const { error: err } = await onSubmit(payload as Parameters<typeof onSubmit>[0]);
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
      title={isEdit ? "작업 수정" : "작업 추가"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">트랙</label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value as TrackId)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {TRACKS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="작업 제목"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">설명 (선택)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="설명"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">담당자 (선택)</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="이름"
          />
        </div>
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-text-secondary">상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {STATUSES.map((s) => (
                <option key={s.status} value={s.status}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
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
