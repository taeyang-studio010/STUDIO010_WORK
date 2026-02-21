"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface OneFourTenItem {
  id: string;
  step: string;
  title: string;
  description?: string;
  position: number;
}

const fallback: OneFourTenItem[] = [
  { id: "1", step: "1", title: "방향성", description: "이번 주 업무 방향 공유", position: 0 },
  { id: "2", step: "4", title: "중간점검", description: "진행 현황 점검", position: 1 },
  { id: "3", step: "10", title: "결과 & 피드백", description: "정기 회의 및 피드백", position: 2 },
];

export function useOneFourTen() {
  const [items, setItems] = useState<OneFourTenItem[]>(fallback);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("one_four_ten")
      .select("*")
      .order("position", { ascending: true });
    if (!error && data?.length) {
      setItems(
        (data as Array<Record<string, unknown>>).map((row) => ({
          id: row.id as string,
          step: String(row.step ?? ""),
          title: String(row.title ?? ""),
          description: row.description != null ? String(row.description) : undefined,
          position: Number(row.position ?? 0),
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    return subscribeTable({
      client: supabase,
      channelName: "one-four-ten-live",
      table: "one_four_ten",
      onChange: load,
    });
  }, [load]);

  const addItem = useCallback(async (payload: { step: string; title: string; description?: string }) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { data: max } = await supabase.from("one_four_ten").select("position").order("position", { ascending: false }).limit(1).single();
    const position = (max?.position ?? -1) + 1;
    const { error } = await supabase.from("one_four_ten").insert({ step: payload.step, title: payload.title, description: payload.description ?? null, position });
    if (!error) load();
    return { error };
  }, [load]);

  const updateItem = useCallback(async (id: string, payload: Partial<{ step: string; title: string; description: string }>) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (payload.step !== undefined) row.step = payload.step;
    if (payload.title !== undefined) row.title = payload.title;
    if (payload.description !== undefined) row.description = payload.description;
    const { error } = await supabase.from("one_four_ten").update(row).eq("id", id);
    if (!error) load();
    return { error };
  }, [load]);

  const removeItem = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { error } = await supabase.from("one_four_ten").delete().eq("id", id);
    if (!error) load();
    return { error };
  }, [load]);

  return { items, loading, addItem, updateItem, removeItem, reload: load };
}
