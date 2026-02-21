"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { useChat } from "@/features/chat/useChat";

const DEFAULT_ROOM_ID = "00000000-0000-0000-0000-000000000001";

export function ChatView() {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(DEFAULT_ROOM_ID);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text);
  }

  return (
    <div className="glass-panel flex flex-1 flex-col overflow-hidden rounded-xl border border-border">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && messages.length === 0 ? (
          <p className="text-sm text-text-tertiary">불러오는 중...</p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === user?.id;
            return (
              <div
                key={m.id}
                className={isMe ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    isMe
                      ? "bg-accent/20 text-white"
                      : "bg-white/[0.06] text-text-secondary"
                  )}
                >
                  {!isMe && (
                    <p className="mb-0.5 text-xs text-text-tertiary">
                      {m.sender_id ? "팀원" : "알 수 없음"}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className="mt-1 text-[10px] opacity-70">
                    {new Date(m.created_at).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지 입력..."
            className="flex-1 rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90 disabled:opacity-50"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
