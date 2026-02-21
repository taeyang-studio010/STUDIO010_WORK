"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useInbox, type InboxRequestItem } from "@/features/inbox/useInbox";
import { Modal } from "@/components/ui/Modal";

export function InboxPanel() {
  const { requests, createRequest, updateRequest, updateRequestStatus, members } = useInbox();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from: "나", to: "", title: "", message: "" });
  const [editing, setEditing] = useState<InboxRequestItem | null>(null);
  const [editForm, setEditForm] = useState({ from: "", to: "", title: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.to || !form.title) return;

    await createRequest({
      from: form.from,
      to: form.to,
      title: form.title,
      message: form.message || undefined,
    });

    setForm({ from: "나", to: "", title: "", message: "" });
    setShowForm(false);
  }

  return (
    <div className="glass-panel flex w-full min-h-full flex-col rounded-xl border border-border p-4 transition-fluid">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">
          업무 요청 인박스
        </h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-accent/20 px-3 py-1.5 text-sm text-accent hover:bg-accent/30"
        >
          {showForm ? "취소" : "+ 요청 보내기"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded-lg border border-border bg-white/[0.03] p-3"
        >
          <select
            value={form.to}
            onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
            className="mb-2 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            required
          >
            <option value="">받는 사람</option>
            {members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="요청 제목"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mb-2 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            required
          />
          <textarea
            placeholder="메시지 (선택)"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={2}
            className="mb-2 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-2 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90"
          >
            전송
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {requests.map((r) => (
          <li
            key={r.id}
            className={cn(
              "rounded-lg border border-border bg-white/[0.02] p-3 transition-fluid",
              r.status === "pending" && "border-accent/30"
            )}
          >
            <p className="text-sm font-medium text-white">
              {r.from} → {r.to}: {r.title}
            </p>
            {r.message && (
              <p className="mt-0.5 text-xs text-text-tertiary">{r.message}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(r);
                  setEditForm({ from: r.from, to: r.to, title: r.title, message: r.message ?? "" });
                }}
                className="text-xs text-text-tertiary hover:text-white"
              >
                편집
              </button>
              <span
                className={cn(
                  "text-xs",
                  r.status === "accepted" && "text-accent",
                  r.status === "rejected" && "text-red-400",
                  r.status === "pending" && "text-amber-400"
                )}
              >
                {r.status === "pending" ? "대기 중" : r.status === "accepted" ? "수락됨" : "거절됨"}
              </span>
              {r.status === "pending" && (
                <>
                  <button type="button" onClick={() => updateRequestStatus(r.id, "accepted")} className="text-xs text-accent hover:underline">수락</button>
                  <button type="button" onClick={() => updateRequestStatus(r.id, "rejected")} className="text-xs text-red-400 hover:underline">거절</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="요청 수정">
        {editing && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updateRequest(editing.id, editForm);
              setEditing(null);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs text-text-secondary">보낸 사람</label>
              <input type="text" value={editForm.from} onChange={(e) => setEditForm((f) => ({ ...f, from: e.target.value }))} required className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary">받는 사람</label>
              <input type="text" value={editForm.to} onChange={(e) => setEditForm((f) => ({ ...f, to: e.target.value }))} required className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white" list="inbox-members" />
              <datalist id="inbox-members">
                {members.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs text-text-secondary">제목</label>
              <input type="text" value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} required className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary">메시지</label>
              <textarea value={editForm.message} onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))} rows={2} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary">취소</button>
              <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-[#0a0a0a]">저장</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
