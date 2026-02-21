"use client";

import { useCallback, useEffect, useState } from "react";
import { initialTasks } from "@/data/mockTasks";
import type { TaskStatus, TrackId } from "@/types/task";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface KanbanTask {
  id: string;
  track: TrackId;
  title: string;
  status: TaskStatus;
  assignee?: string;
  description?: string;
  createdAt: string;
}

const fallbackTasks: KanbanTask[] = initialTasks.map((task) => ({
  ...task,
  description: task.description,
}));

export function useKanban() {
  const [tasks, setTasks] = useState<KanbanTask[]>(fallbackTasks);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const rows = data as Array<Record<string, any>>;
    setTasks(
      rows.map((row) => ({
        id: row.id,
        track: row.track,
        title: row.title,
        description: row.description ?? undefined,
        status: row.status,
        assignee: row.assignee ?? undefined,
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
      channelName: "tasks-live",
      table: "tasks",
      onChange: load,
    });
    return unsub;
  }, [load]);

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, last_updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) {
      load();
    }
  }, [load]);

  const createTask = useCallback(
    async (payload: {
      track: TrackId;
      title: string;
      description?: string;
      assignee?: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          track: payload.track,
          title: payload.title,
          description: payload.description ?? null,
          assignee: payload.assignee ?? null,
          status: "todo",
        })
        .select("id")
        .single();
      if (!error) load();
      return { data, error };
    },
    [load]
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      payload: Partial<{
        track: TrackId;
        title: string;
        description: string;
        status: TaskStatus;
        assignee: string;
      }>
    ) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const row: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
      if (payload.track !== undefined) row.track = payload.track;
      if (payload.title !== undefined) row.title = payload.title;
      if (payload.description !== undefined) row.description = payload.description;
      if (payload.status !== undefined) row.status = payload.status;
      if (payload.assignee !== undefined) row.assignee = payload.assignee;
      const { error } = await supabase.from("tasks").update(row).eq("id", taskId);
      if (!error) load();
      return { error };
    },
    [load]
  );

  return { tasks, loading, moveTask, createTask, updateTask, reload: load };
}
