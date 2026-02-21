"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";
import type { KpiScope } from "@/lib/supabase/database.types";
import {
  mainKpiGoals,
  monthlyKpiGoals,
  weeklyKpiGoals,
  type KpiGoal,
} from "@/data/mockKpi";

type KpiItem = KpiGoal & { checked: boolean; kpiSetId?: string };
type KpiMap = Record<KpiScope, KpiItem[]>;

const fallbackData: KpiMap = {
  main: mainKpiGoals.map((goal) => ({ ...goal, checked: false })),
  monthly: monthlyKpiGoals.map((goal) => ({ ...goal, checked: false })),
  weekly: weeklyKpiGoals.map((goal) => ({ ...goal, checked: false })),
};

function normalizeKpiRows(rows: any[]): KpiMap {
  const empty: KpiMap = { main: [], monthly: [], weekly: [] };

  rows.forEach((set) => {
    const scope = set.scope as KpiScope;
    const items = [...(set.kpi_items ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        id: item.id,
        label: item.label,
        checked: item.checked,
        kpiSetId: set.id,
      }));
    empty[scope] = items;
  });

  return {
    main: empty.main.length ? empty.main : fallbackData.main,
    monthly: empty.monthly.length ? empty.monthly : fallbackData.monthly,
    weekly: empty.weekly.length ? empty.weekly : fallbackData.weekly,
  };
}

export function useKpi() {
  const [kpis, setKpis] = useState<KpiMap>(fallbackData);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("kpi_sets")
      .select("id, scope, kpi_items(id, label, checked, position)")
      .is("deleted_at", null);

    if (error || !data) {
      setLoading(false);
      return;
    }

    setKpis(normalizeKpiRows(data as any[]));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const unsubKpiSets = subscribeTable({
      client: supabase,
      channelName: "kpi-sets-live",
      table: "kpi_sets",
      onChange: load,
    });
    const unsubKpiItems = subscribeTable({
      client: supabase,
      channelName: "kpi-items-live",
      table: "kpi_items",
      onChange: load,
    });

    return () => {
      unsubKpiSets();
      unsubKpiItems();
    };
  }, [load]);

  const toggleGoal = useCallback(
    async (scope: KpiScope, id: string) => {
      const target = kpis[scope].find((item) => item.id === id);
      if (!target) return;

      setKpis((prev) => ({
        ...prev,
        [scope]: prev[scope].map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      }));

      const supabase = getSupabaseBrowserClient();
      if (!supabase || !target.kpiSetId) return;

      const { error } = await supabase
        .from("kpi_items")
        .update({ checked: !target.checked, last_updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        load();
      }
    },
    [kpis, load]
  );

  const getSetIdForScope = useCallback(
    async (scope: KpiScope): Promise<string | null> => {
      const first = kpis[scope][0];
      if (first?.kpiSetId) return first.kpiSetId;
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return null;
      const { data } = await supabase
        .from("kpi_sets")
        .select("id")
        .eq("scope", scope)
        .limit(1)
        .single();
      return data?.id ?? null;
    },
    [kpis]
  );

  const addItem = useCallback(
    async (scope: KpiScope, label: string) => {
      const setId = await getSetIdForScope(scope);
      if (!setId) return { error: new Error("KPI 세트를 찾을 수 없습니다.") };
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data: items } = await supabase.from("kpi_items").select("position").eq("kpi_set_id", setId).order("position", { ascending: false }).limit(1);
      const position = (items?.[0]?.position ?? -1) + 1;
      const { error } = await supabase.from("kpi_items").insert({ kpi_set_id: setId, label, checked: false, position });
      if (!error) load();
      return { error };
    },
    [getSetIdForScope, load]
  );

  const updateItem = useCallback(
    async (id: string, label: string) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { error } = await supabase.from("kpi_items").update({ label, last_updated_at: new Date().toISOString() }).eq("id", id);
      if (!error) load();
      return { error };
    },
    [load]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { error } = await supabase.from("kpi_items").update({ deleted_at: new Date().toISOString() }).eq("id", id);
      if (!error) load();
      return { error };
    },
    [load]
  );

  const progress = useMemo(() => {
    const calc = (items: KpiItem[]) => {
      const checked = items.filter((item) => item.checked).length;
      return items.length ? (checked / items.length) * 100 : 0;
    };
    return {
      main: calc(kpis.main),
      monthly: calc(kpis.monthly),
      weekly: calc(kpis.weekly),
    };
  }, [kpis]);

  return { kpis, progress, loading, toggleGoal, addItem, updateItem, removeItem };
}
