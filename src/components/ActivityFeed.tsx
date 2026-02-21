"use client";

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

export function ActivityFeed() {
  const { logs } = useAuditLogs(30);

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-[300px] shrink-0 flex-col",
        "glass-panel-strong border-0 border-l border-border",
        "max-xl:w-[260px] max-lg:hidden"
      )}
    >
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
    </aside>
  );
}
