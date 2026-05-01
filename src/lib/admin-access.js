import { redirect } from "next/navigation";

import { getAdminEmails, hasSupabaseAdminConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getViewerContext() {
  if (!hasSupabaseAdminConfig()) {
    return {
      mode: "setup",
      user: null,
      profile: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      mode: "guest",
      user: null,
      profile: null,
    };
  }

  const role = getAdminEmails().includes((user.email || "").toLowerCase())
    ? "admin"
    : "student";

  const adminClient = createSupabaseAdminClient();
  const profilePayload = {
    id: user.id,
    email: user.email || "",
    display_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Member",
    role,
  };

  await adminClient.from("profiles").upsert(profilePayload, { onConflict: "id" });

  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    mode: "authenticated",
    user,
    profile: profile || profilePayload,
  };
}

export async function requireAdminAccess() {
  const viewer = await getViewerContext();

  if (viewer.mode === "setup") {
    return viewer;
  }

  if (viewer.mode === "guest") {
    redirect("/auth/login?next=/admin");
  }

  if (viewer.profile?.role !== "admin") {
    redirect("/auth/login?reason=forbidden");
  }

  return viewer;
}
