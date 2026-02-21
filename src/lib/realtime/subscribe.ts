import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

interface SubscribeTableParams {
  client: SupabaseClient<Database>;
  channelName: string;
  table: keyof Database["public"]["Tables"] & string;
  schema?: string;
  onChange: () => void;
}

export function subscribeTable({
  client,
  channelName,
  table,
  schema = "public",
  onChange,
}: SubscribeTableParams) {
  const channel = client
    .channel(channelName)
    .on(
      "postgres_changes",
      { event: "*", schema, table },
      () => {
        onChange();
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
