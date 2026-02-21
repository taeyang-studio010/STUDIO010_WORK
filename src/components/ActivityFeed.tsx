"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuditLogs } from "@/features/audit/useAuditLogs";

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function FeedContent({
  logs,
}: {
  logs: Array<{ id: string; actorId?: string; action: string; tableName: string; createdAt: string }>;
}) {
  return (
    <>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-text-secondary">
          액티비티
        </h3>
      </div>
      <ul className="flex-1 space-y-0 overflow-y-auto p-3">
        {logs.map((log) => (
          <li
            key={log.id}
            className={cn(
              "animate-fade-in rounded-lg px-3 py-2 text-sm transition-fluid",
              "hover:bg-white/[0.04]"
            )}
          >
            <p className="text-white">
              <span className="font-medium text-accent">
                {log.actorId?.slice(0, 8) ?? "system"}
              </span>
              <span className="text-text-secondary"> {log.action} · </span>
              <span className="text-text-secondary">{log.tableName}</span>
            </p>
            <p className="mt-0.5 text-xs text-text-tertiary">
              {formatRelative(log.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ActivityFeed() {
  const { logs } = useAuditLogs(30);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 데스크톱: 항상 보이는 패널 */}
      <aside
        className={cn(
          "hidden lg:flex h-full min-h-0 w-[300px] shrink-0 flex-col",
          "glass-panel-strong border-0 border-l border-border",
          "xl:w-[300px]"
        )}
      >
        <FeedContent logs={logs} />
      </aside>

      {/* 모바일/태블릿: 토글 버튼 + 슬라이드 패널 */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-[var(--bg)]/90 px-3 py-2 text-xs font-medium text-text-secondary shadow-lg backdrop-blur-md hover:bg-white/5 hover:text-white"
          aria-label="액티비티 열기"
        >
          액티비티
        </button>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <aside
              className={cn(
                "fixed right-0 top-0 z-50 flex h-full w-[280px] max-w-[90vw] flex-col",
                "glass-panel-strong border-0 border-l border-border",
                "animate-slide-in-right"
              )}
              role="dialog"
              aria-label="액티비티"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  액티비티
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-text-secondary hover:bg-white/5 hover:text-white"
                  aria-label="닫기"
                >
                  ×
                </button>
              </div>
              <ul className="flex-1 space-y-0 overflow-y-auto p-3">
                {logs.map((log) => (
                  <li
                    key={log.id}
                    className={cn(
                      "animate-fade-in rounded-lg px-3 py-2 text-sm transition-fluid",
                      "hover:bg-white/[0.04]"
                    )}
                  >
                    <p className="text-white">
                      <span className="font-medium text-accent">
                        {log.actorId?.slice(0, 8) ?? "system"}
                      </span>
                      <span className="text-text-secondary"> {log.action} · </span>
                      <span className="text-text-secondary">{log.tableName}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      {formatRelative(log.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </>
        )}
      </div>
    </>
  );
}
