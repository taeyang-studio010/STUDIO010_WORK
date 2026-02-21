"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mockBudget } from "@/data/mockBudget";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface BudgetProjectItem {
  id: string;
  name: string;
  total: number;
  spent: number;
  isGovernment?: boolean;
}

const fallbackProjects: BudgetProjectItem[] = mockBudget.map((item) => ({
  ...item,
  isGovernment: item.isGovernment,
}));

export function useBudget() {
  const [projects, setProjects] = useState<BudgetProjectItem[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("budget_projects")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const rows = data as Array<Record<string, any>>;
    setProjects(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        total: Number(row.total),
        spent: Number(row.spent),
        isGovernment: row.is_government,
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

    const unsubProjects = subscribeTable({
      client: supabase,
      channelName: "budget-projects-live",
      table: "budget_projects",
      onChange: load,
    });
    const unsubEntries = subscribeTable({
      client: supabase,
      channelName: "budget-entries-live",
      table: "budget_entries",
      onChange: load,
    });

    return () => {
      unsubProjects();
      unsubEntries();
    };
  }, [load]);

  const totalBudget = useMemo(
    () => projects.reduce((sum, project) => sum + project.total, 0),
    [projects]
  );
  const totalSpent = useMemo(
    () => projects.reduce((sum, project) => sum + project.spent, 0),
    [projects]
  );

  const createProject = useCallback(
    async (payload: { name: string; total: number; isGovernment?: boolean }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data, error } = await supabase
        .from("budget_projects")
        .insert({
          name: payload.name,
          total: payload.total,
          spent: 0,
          is_government: payload.isGovernment ?? false,
        })
        .select("id")
        .single();
      if (!error) load();
      return { data, error };
    },
    [load]
  );

  const updateProject = useCallback(
    async (
      projectId: string,
      payload: Partial<{ name: string; total: number; isGovernment: boolean }>
    ) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const row: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
      if (payload.name !== undefined) row.name = payload.name;
      if (payload.total !== undefined) row.total = payload.total;
      if (payload.isGovernment !== undefined) row.is_government = payload.isGovernment;
      const { error } = await supabase
        .from("budget_projects")
        .update(row)
        .eq("id", projectId);
      if (!error) load();
      return { error };
    },
    [load]
  );

  const addEntry = useCallback(
    async (payload: {
      budgetProjectId: string;
      amount: number;
      note?: string;
      spentAt?: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { error: insertErr } = await supabase.from("budget_entries").insert({
        budget_project_id: payload.budgetProjectId,
        amount: payload.amount,
        note: payload.note ?? null,
        spent_at: payload.spentAt ?? new Date().toISOString().slice(0, 10),
      });
      if (insertErr) return { error: insertErr };
      const proj = projects.find((p) => p.id === payload.budgetProjectId);
      const newSpent = (proj?.spent ?? 0) + payload.amount;
      const { error: updateErr } = await supabase
        .from("budget_projects")
        .update({ spent: newSpent, last_updated_at: new Date().toISOString() })
        .eq("id", payload.budgetProjectId);
      if (!updateErr) load();
      return { error: updateErr };
    },
    [load, projects]
  );

  return {
    projects,
    totalBudget,
    totalSpent,
    loading,
    createProject,
    updateProject,
    addEntry,
    reload: load,
  };
}
