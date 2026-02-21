"use client";

import { useState } from "react";

export function useExecInvite() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function inviteExec(payload: { email: string; name?: string; role?: string }) {
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/exec-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "초대 요청에 실패했습니다.");
      }

      setMessage("임원 초대 메일을 전송했습니다.");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "초대 전송 중 오류가 발생했습니다.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return { inviteExec, submitting, message };
}
