"use client";

import { useCallback, useEffect, useState } from "react";
import { mockAssets, mockKnowledge } from "@/data/mockInsights";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { subscribeTable } from "@/lib/realtime/subscribe";

export interface KnowledgeItem {
  id: string;
  title: string;
  type: "reference" | "webinar" | "meeting";
  description?: string;
  link?: string;
  date?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: "logo" | "color" | "font" | "document";
  value?: string;
  description?: string;
}

export function useStorage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(mockKnowledge);
  const [assets, setAssets] = useState<AssetItem[]>(mockAssets);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const [knowledgeRes, assetsRes] = await Promise.all([
      supabase
        .from("knowledge_items")
        .select("*")
        .is("deleted_at", null)
        .order("date", { ascending: false }),
      supabase
        .from("asset_items")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
    ]);

    if (!knowledgeRes.error && knowledgeRes.data) {
      const knowledgeRows = knowledgeRes.data as Array<Record<string, any>>;
      setKnowledge(
        knowledgeRows.map((row) => ({
          id: row.id,
          title: row.title,
          type: row.type,
          description: row.description ?? undefined,
          link: row.link ?? undefined,
          date: row.date ?? undefined,
        }))
      );
    }

    if (!assetsRes.error && assetsRes.data) {
      const assetRows = assetsRes.data as Array<Record<string, any>>;
      setAssets(
        assetRows.map((row) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          value: row.value ?? undefined,
          description: row.description ?? undefined,
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

    const unsubKnowledge = subscribeTable({
      client: supabase,
      channelName: "knowledge-live",
      table: "knowledge_items",
      onChange: load,
    });
    const unsubAssets = subscribeTable({
      client: supabase,
      channelName: "assets-live",
      table: "asset_items",
      onChange: load,
    });

    return () => {
      unsubKnowledge();
      unsubAssets();
    };
  }, [load]);

  const createKnowledge = useCallback(
    async (payload: {
      title: string;
      type: KnowledgeItem["type"];
      description?: string;
      link?: string;
      date?: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data, error } = await supabase
        .from("knowledge_items")
        .insert({
          title: payload.title,
          type: payload.type,
          description: payload.description ?? null,
          link: payload.link ?? null,
          date: payload.date ?? null,
        })
        .select("id")
        .single();
      if (!error) load();
      return { data, error };
    },
    [load]
  );

  const updateKnowledge = useCallback(
    async (
      id: string,
      payload: Partial<{
        title: string;
        type: KnowledgeItem["type"];
        description: string;
        link: string;
        date: string;
      }>
    ) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const row: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
      if (payload.title !== undefined) row.title = payload.title;
      if (payload.type !== undefined) row.type = payload.type;
      if (payload.description !== undefined) row.description = payload.description;
      if (payload.link !== undefined) row.link = payload.link;
      if (payload.date !== undefined) row.date = payload.date;
      const { error } = await supabase
        .from("knowledge_items")
        .update(row)
        .eq("id", id);
      if (!error) load();
      return { error };
    },
    [load]
  );

  const createAsset = useCallback(
    async (payload: {
      name: string;
      type: AssetItem["type"];
      value?: string;
      description?: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const { data, error } = await supabase
        .from("asset_items")
        .insert({
          name: payload.name,
          type: payload.type,
          value: payload.value ?? null,
          description: payload.description ?? null,
        })
        .select("id")
        .single();
      if (!error) load();
      return { data, error };
    },
    [load]
  );

  const updateAsset = useCallback(
    async (
      id: string,
      payload: Partial<{
        name: string;
        type: AssetItem["type"];
        value: string;
        description: string;
      }>
    ) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: new Error("Supabase not configured") };
      const row: Record<string, unknown> = { last_updated_at: new Date().toISOString() };
      if (payload.name !== undefined) row.name = payload.name;
      if (payload.type !== undefined) row.type = payload.type;
      if (payload.value !== undefined) row.value = payload.value;
      if (payload.description !== undefined) row.description = payload.description;
      const { error } = await supabase.from("asset_items").update(row).eq("id", id);
      if (!error) load();
      return { error };
    },
    [load]
  );

  return {
    knowledge,
    assets,
    loading,
    createKnowledge,
    updateKnowledge,
    createAsset,
    updateAsset,
    reload: load,
  };
}
