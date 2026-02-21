"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface ChatRoom {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string | null;
  body: string;
  created_at: string;
  sender_email?: string;
}

const DEFAULT_ROOM_ID = "00000000-0000-0000-0000-000000000001";

export function useChat(roomId: string | null) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { data } = await supabase.from("chat_rooms").select("id, name").order("created_at");
    if (data) setRooms(data as ChatRoom[]);
  }, []);

  const loadMessages = useCallback(async () => {
    const rid = roomId ?? DEFAULT_ROOM_ID;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, room_id, sender_id, body, created_at")
      .eq("room_id", rid)
      .order("created_at", { ascending: true });
    if (error) {
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    setMessages(
      rows.map((r) => ({
        id: r.id as string,
        room_id: r.room_id as string,
        sender_id: r.sender_id as string | null,
        body: r.body as string,
        created_at: r.created_at as string,
      }))
    );
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    setLoading(true);
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !roomId) return;
    const rid = roomId ?? DEFAULT_ROOM_ID;
    const channel = supabase.channel("chat-messages-" + rid).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${rid}` },
      loadMessages
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, loadMessages]);

  const sendMessage = useCallback(
    async (body: string) => {
      const rid = roomId ?? DEFAULT_ROOM_ID;
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("chat_messages").insert({
        room_id: rid,
        sender_id: user?.id ?? null,
        body: body.trim(),
      });
      if (!error) loadMessages();
      return { error };
    },
    [roomId, loadMessages]
  );

  return { rooms, messages, loading, sendMessage, reload: loadMessages };
}
