"use client";

import { useCallback, useEffect, useState } from "react";
import { initialInbox } from "@/data/mockTasks";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export type InboxStatus = "pending" | "accepted" | "rejected";

export interface InboxRequestItem {
  id: string;
  from: string;
  to: string;
  title: string;
  message?: string;
  status: InboxStatus;
  createdAt: string;
}

const fallbackRequests: InboxRequestItem[] = [...initialInbox];
export const defaultMembers = ["태양", "지희", "해인", "성기"];

export function useInbox() {
  const [requests, setRequests] = useState<InboxRequestItem[]>(fallbackRequests);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("inbox_requests")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const rows = data as Array<Record<string, any>>;
    setRequests(
      rows.map((row) => ({
        id: row.id,
        from: row.from_name,
        to: row.to_name,
        title: row.title,
        message: row.message ?? undefined,
        status: row.status,
        createdAt: row.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const unsub = subscribeTable({
      client: supabase,
      channelName: "inbox-live",
      table: "inbox_requests",
      onChange: load,
    });
    return unsub;
  }, [load]);

  const updateRequestStatus = useCallback(
    async (id: string, status: InboxStatus) => {
      setRequests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { error } = await supabase
        .from("inbox_requests")
        .update({ status, last_updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        load();
      }
    },
    [load]
  );

  const updateRequest = useCallback(
    async (id: string, payload: { from?: string; to?: string; title?: string; message?: string }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const row: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
      if (payload.from !== undefined) row.from_name = payload.from;
      if (payload.to !== undefined) row.to_name = payload.to;
      if (payload.title !== undefined) row.title = payload.title;
      if (payload.message !== undefined) row.message = payload.message;
      const { error } = await supabase.from("inbox_requests").update(row).eq("id", id);
      if (!error) load();
      return { error };
    },
    [load]
  );

  const createRequest = useCallback(
    async (payload: { from: string; to: string; title: string; message?: string }) => {
      const optimistic: InboxRequestItem = {
        id: `local-${Date.now()}`,
        ...payload,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setRequests((prev) => [optimistic, ...prev]);

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { error } = await supabase.from("inbox_requests").insert({
        from_name: payload.from,
        to_name: payload.to,
        title: payload.title,
        message: payload.message ?? null,
        status: "pending",
      });

      if (error) {
        load();
      }
    },
    [load]
  );

  return { requests, loading, createRequest, updateRequest, updateRequestStatus, members: defaultMembers };
}
