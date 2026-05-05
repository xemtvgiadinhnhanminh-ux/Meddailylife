"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAccess } from "@/lib/admin-access";
import { getCollectionConfig } from "@/lib/content-config";
import { hasSupabaseAdminConfig } from "@/lib/env";
import { getCollectionRow } from "@/lib/content-store";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function encodeMessage(message) {
  return encodeURIComponent(message);
}

function parseJsonValue(rawValue, fallbackValue) {
  if (!rawValue) {
    return fallbackValue;
  }

  return JSON.parse(rawValue);
}

function normalizeFieldValue(field, formData, fallbackValue) {
  const rawValue = formData.get(field.name);

  if (field.type === "boolean") {
    return rawValue === "on";
  }

  if (field.type === "number") {
    return Number(rawValue || 0);
  }

  if (field.type === "json") {
    return parseJsonValue(String(rawValue || "").trim(), fallbackValue);
  }

  return String(rawValue || "").trim();
}

function buildPayload(collection, formData) {
  const payload = {};

  for (const field of collection.fields) {
    payload[field.name] = normalizeFieldValue(
      field,
      formData,
      collection.emptyValue[field.name]
    );
  }

  return payload;
}

function getEditorPath(collectionKey, routeId) {
  return routeId === "new"
    ? `/admin/${collectionKey}/new`
    : `/admin/${collectionKey}/${routeId}`;
}

export async function saveCollectionItemAction(collectionKey, routeId, formData) {
  try {
    await requireAdminAccess();

    if (!hasSupabaseAdminConfig()) {
      redirect(`/admin?error=${encodeMessage("Cần kết nối Supabase trước khi lưu nội dung.")}`);
    }

    const collection = getCollectionConfig(collectionKey);
    if (!collection) {
      redirect(`/admin?error=${encodeMessage("Collection không hợp lệ.")}`);
    }

    const payload = buildPayload(collection, formData);
    const client = createSupabaseAdminClient();

    if (routeId === "new") {
      const { data, error } = await client
        .from(collection.table)
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      revalidatePath("/admin");
      revalidatePath(`/admin/${collectionKey}`);
      revalidatePath(collection.routeBase);
      redirect(`/admin/${collectionKey}/${data.id}`);
    }

    const existing = await getCollectionRow(collectionKey, routeId, {
      admin: true,
      databaseOnly: true,
    });

    if (!existing?.id) {
      throw new Error("Không tìm thấy bản ghi cần cập nhật.");
    }

    const { data, error } = await client
      .from(collection.table)
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/${collectionKey}`);
    revalidatePath(collection.routeBase);
    redirect(`/admin/${collectionKey}/${data.id}?message=${encodeMessage("Đã lưu thay đổi.")}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể lưu nội dung.";
    redirect(`${getEditorPath(collectionKey, routeId)}?error=${encodeMessage(message)}`);
  }
}

export async function deleteCollectionItemAction(collectionKey, routeId) {
  try {
    await requireAdminAccess();

    if (!hasSupabaseAdminConfig()) {
      redirect(`/admin/${collectionKey}?error=${encodeMessage("Cần kết nối Supabase trước khi xóa.")}`);
    }

    const collection = getCollectionConfig(collectionKey);
    if (!collection) {
      redirect(`/admin?error=${encodeMessage("Collection không hợp lệ.")}`);
    }

    const existing = await getCollectionRow(collectionKey, routeId, {
      admin: true,
      databaseOnly: true,
    });

    if (!existing?.id) {
      throw new Error("Không tìm thấy bản ghi cần xóa.");
    }

    const client = createSupabaseAdminClient();
    const { error } = await client.from(collection.table).delete().eq("id", existing.id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/${collectionKey}`);
    revalidatePath(collection.routeBase);
    redirect(`/admin/${collectionKey}?message=${encodeMessage("Đã xóa bản ghi.")}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể xóa bản ghi.";
    redirect(`${getEditorPath(collectionKey, routeId)}?error=${encodeMessage(message)}`);
  }
}

