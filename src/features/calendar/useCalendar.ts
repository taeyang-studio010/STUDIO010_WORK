"use client";

import { useCallback, useEffect, useState } from "react";
import { mockEvents } from "@/data/mockCalendar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "milestone" | "deadline" | "regular";
  description?: string;
  allDay?: boolean;
}

const fallbackEvents: CalendarEventItem[] = [...mockEvents];

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .is("deleted_at", null)
      .order("date", { ascending: true });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const rows = data as Array<Record<string, any>>;
    setEvents(
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        date: row.date,
        type: row.type,
        description: row.description ?? undefined,
        allDay: row.all_day,
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
      channelName: "calendar-live",
      table: "calendar_events",
      onChange: load,
    });
    return unsub;
  }, [load]);

  const createEvent = useCallback(
    async (payload: {
      title: string;
      date: string;
      type?: CalendarEventItem["type"];
      description?: string;
      allDay?: boolean;
    }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data, error } = await supabase
        .from("calendar_events")
        .insert({
          title: payload.title,
          date: payload.date,
          type: payload.type ?? "regular",
          description: payload.description ?? null,
          all_day: payload.allDay ?? true,
        })
        .select("id")
        .single();
      if (!error) load();
      return { data, error };
    },
    [load]
  );

  const updateEvent = useCallback(
    async (
      eventId: string,
      payload: Partial<{
        title: string;
        date: string;
        type: CalendarEventItem["type"];
        description: string;
        allDay: boolean;
      }>
    ) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const row: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
      if (payload.title !== undefined) row.title = payload.title;
      if (payload.date !== undefined) row.date = payload.date;
      if (payload.type !== undefined) row.type = payload.type;
      if (payload.description !== undefined) row.description = payload.description;
      if (payload.allDay !== undefined) row.all_day = payload.allDay;
      const { error } = await supabase
        .from("calendar_events")
        .update(row)
        .eq("id", eventId);
      if (!error) load();
      return { error };
    },
    [load]
  );

  const deleteEvent = useCallback(async (eventId: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { error } = await supabase
      .from("calendar_events")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", eventId);
    if (!error) load();
    return { error };
  }, [load]);

  return { events, loading, createEvent, updateEvent, deleteEvent, reload: load };
}
