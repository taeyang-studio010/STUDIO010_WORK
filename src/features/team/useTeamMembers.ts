"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface TeamMemberItem {
  id: string;
  name: string;
  role?: string;
  status: string;
  location: string;
}

const fallback: TeamMemberItem[] = [
  { id: "1", name: "태양", role: "기획/총괄", status: "업무중", location: "사무실" },
  { id: "2", name: "지희", role: "디자인/기술", status: "업무중", location: "재택" },
  { id: "3", name: "해인", role: "재무/마케팅", status: "회의중", location: "외부미팅" },
  { id: "4", name: "성기", role: "오퍼레이션/공간", status: "휴식", location: "사무실" },
];

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMemberItem[]>(fallback);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: true });
    if (!error && data?.length) {
      setMembers(
        (data as Array<Record<string, unknown>>).map((row) => ({
          id: row.id as string,
          name: String(row.name ?? ""),
          role: row.role != null ? String(row.role) : undefined,
          status: String(row.status ?? "업무중"),
          location: String(row.location ?? "사무실"),
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
      channelName: "team-members-live",
      table: "team_members",
      onChange: load,
    });
  }, [load]);

  const addMember = useCallback(async (payload: { name: string; role?: string; status?: string; location?: string }) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { error } = await supabase.from("team_members").insert({
      name: payload.name,
      role: payload.role ?? null,
      status: payload.status ?? "업무중",
      location: payload.location ?? "사무실",
    });
    if (!error) load();
    return { error };
  }, [load]);

  const updateMember = useCallback(async (id: string, payload: Partial<{ name: string; role: string; status: string; location: string }>) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (payload.name !== undefined) row.name = payload.name;
    if (payload.role !== undefined) row.role = payload.role;
    if (payload.status !== undefined) row.status = payload.status;
    if (payload.location !== undefined) row.location = payload.location;
    const { error } = await supabase.from("team_members").update(row).eq("id", id);
    if (!error) load();
    return { error };
  }, [load]);

  const removeMember = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (!error) load();
    return { error };
  }, [load]);

  return { members, loading, addMember, updateMember, removeMember, reload: load };
}
