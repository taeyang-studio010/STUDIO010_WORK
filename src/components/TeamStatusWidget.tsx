"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTeamMembers, type TeamMemberItem } from "@/features/team/useTeamMembers";
import { Modal } from "@/components/ui/Modal";

const statusConfig: Record<string, string> = {
  업무중: "bg-emerald-500",
  휴식: "bg-amber-500",
  회의중: "bg-blue-500",
};
const locationConfig: Record<string, string> = {
  사무실: "🏢",
  재택: "🏠",
  외부미팅: "📍",
};

export function TeamStatusWidget() {
  const { members, addMember, updateMember, removeMember } = useTeamMembers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberItem | null>(null);
  const [form, setForm] = useState({ name: "", role: "", status: "업무중", location: "사무실" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", role: "", status: "업무중", location: "사무실" });
    setModalOpen(true);
  };
  const openEdit = (m: TeamMemberItem) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role ?? "", status: m.status, location: m.location });
    setModalOpen(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateMember(editing.id, form);
    } else {
      await addMember(form);
    }
    setModalOpen(false);
  }

  return (
    <div className="glass-panel flex w-full min-h-full flex-col rounded-xl border border-border p-4 transition-fluid hover-lift">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">팀 상태</h3>
        <button type="button" onClick={openAdd} className="rounded bg-accent/20 px-2 py-1 text-xs text-accent hover:bg-accent/30">+ 추가</button>
      </div>
      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            role="button"
            tabIndex={0}
            onClick={() => openEdit(m)}
            onKeyDown={(e) => e.key === "Enter" && openEdit(m)}
            className={cn(
              "flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 transition-fluid cursor-pointer",
              "hover:bg-white/[0.06]"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", statusConfig[m.status] ?? "bg-gray-500")} />
              <span className="font-medium text-white">{m.name}</span>
              <span className="text-xs text-text-tertiary">{m.role}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span aria-hidden>{locationConfig[m.location] ?? "•"}</span>
              <span className="text-xs">{m.location}</span>
            </div>
          </li>
        ))}
      </ul>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "팀원 수정" : "팀원 추가"}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-text-secondary">이름</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary">역할</label>
            <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary">상태</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white">
              <option value="업무중">업무중</option>
              <option value="휴식">휴식</option>
              <option value="회의중">회의중</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-secondary">위치</label>
            <select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-white">
              <option value="사무실">사무실</option>
              <option value="재택">재택</option>
              <option value="외부미팅">외부미팅</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            {editing && <button type="button" onClick={() => removeMember(editing.id).then(() => setModalOpen(false))} className="rounded-lg border border-red-500/50 px-3 py-1.5 text-xs text-red-400">삭제</button>}
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary">취소</button>
            <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-[#0a0a0a]">저장</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
