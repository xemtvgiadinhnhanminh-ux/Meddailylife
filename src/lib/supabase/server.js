import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getSupabaseConfig, hasSupabaseBrowserConfig } from "@/lib/env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseBrowserConfig()) {
    throw new Error("Supabase browser config is missing.");
  }

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignored in read-only server contexts.
        }
      },
    },
  });
}

