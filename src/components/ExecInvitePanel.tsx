"use client";

import { useState } from "react";
import { useExecInvite } from "@/features/invite/useExecInvite";

export function ExecInvitePanel() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("임원");
  const { inviteExec, submitting, message } = useExecInvite();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    const success = await inviteExec({
      email: email.trim(),
      name: name.trim() || undefined,
      role: role.trim() || undefined,
    });
    if (success) {
      setEmail("");
      setName("");
      setRole("임원");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-2 rounded-lg border border-border bg-white/[0.02] p-3 max-lg:hidden"
    >
      <p className="text-xs font-medium text-text-secondary">임원 초대</p>
      <input
        type="email"
        placeholder="email@studio010.kr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border border-border bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none"
        required
      />
      <input
        type="text"
        placeholder="이름 (선택)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded border border-border bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none"
      />
      <input
        type="text"
        placeholder="역할"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full rounded border border-border bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-accent px-2 py-1.5 text-xs font-medium text-[#0a0a0a] hover:bg-accent/90 disabled:opacity-60"
      >
        {submitting ? "초대 중..." : "초대 메일 전송"}
      </button>
      {message && <p className="text-[11px] text-text-tertiary">{message}</p>}
    </form>
  );
}
