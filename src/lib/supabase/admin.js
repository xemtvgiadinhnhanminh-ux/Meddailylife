import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig, hasSupabaseAdminConfig } from "@/lib/env";

let cachedClient = null;

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin config is missing.");
  }

  if (cachedClient) {
    return cachedClient;
  }

  const { url, serviceRoleKey } = getSupabaseConfig();

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}

