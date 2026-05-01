"use server";

import { redirect } from "next/navigation";

import { hasSupabaseBrowserConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function encodeMessage(message) {
  return encodeURIComponent(message);
}

export async function loginAction(formData) {
  const nextPath = String(formData.get("next") || "/admin");

  if (!hasSupabaseBrowserConfig()) {
    redirect(`/auth/login?error=${encodeMessage("Supabase chưa được cấu hình.")}`);
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeMessage(error.message)}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function signUpAction(formData) {
  if (!hasSupabaseBrowserConfig()) {
    redirect(`/auth/login?error=${encodeMessage("Supabase chưa được cấu hình.")}`);
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeMessage(error.message)}`);
  }

  redirect(`/auth/login?message=${encodeMessage("Tài khoản đã được tạo. Hãy đăng nhập để vào admin.")}`);
}

export async function signOutAction() {
  if (hasSupabaseBrowserConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}

