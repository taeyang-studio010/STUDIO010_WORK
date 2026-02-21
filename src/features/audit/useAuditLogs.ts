"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface AuditLogItem {
  id: string;
  tableName: string;
  action: "insert" | "update" | "delete";
  actorId?: string;
  createdAt: string;
}

const fallbackActivities: AuditLogItem[] = [
  {
    id: "f1",
    tableName: "tasks",
    action: "update",
    actorId: "지희",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "f2",
    tableName: "asset_items",
    action: "insert",
    actorId: "해인",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

export function useAuditLogs(limit = 20) {
  const [logs, setLogs] = useState<AuditLogItem[]>(fallbackActivities);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, table_name, action, actor_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      setLoading(false);
      return;
    }

    const rows = data as Array<Record<string, any>>;
    setLogs(
      rows.map((row) => ({
        id: row.id,
        tableName: row.table_name,
        action: row.action,
        actorId: row.actor_id ?? undefined,
        createdAt: row.created_at,
      }))
    );
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const unsub = subscribeTable({
      client: supabase,
      channelName: "audit-live",
      table: "audit_logs",
      onChange: load,
    });
    return unsub;
  }, [load]);

  return { logs, loading, reload: load };
}
