import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";

let client: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) return null;
  if (client) return client;

  const { url, anonKey } = getSupabaseEnv();
  client = createBrowserClient<Database>(url, anonKey);
  return client;
}
