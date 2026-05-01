import { getCollectionConfig, listCollectionConfigs } from "@/lib/content-config";
import { hasSupabaseAdminConfig } from "@/lib/env";
import {
  getFallbackCollection,
  getFallbackCollectionItem,
  getFallbackStats,
} from "@/lib/legacy-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function listRowsFromDatabase(collectionKey, config, { admin = false } = {}) {
  const client = createSupabaseAdminClient();
  let query = client.from(config.table).select("*");

  if (!admin && config.fields.some((field) => field.name === "published")) {
    query = query.eq("published", true);
  }

  if (config.orderBy) {
    query = query.order(config.orderBy, { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.warn(`[content-store] Failed loading ${collectionKey}:`, error.message);
    return null;
  }

  return data || [];
}

async function getRowFromDatabase(collectionKey, config, routeId) {
  const rows = await listRowsFromDatabase(collectionKey, config, { admin: true });
  if (!rows) return null;

  return (
    rows.find((item) =>
      [item.id, item[config.slugField], item.legacy_id]
        .filter(Boolean)
        .map(String)
        .includes(String(routeId))
    ) || null
  );
}

export async function listCollectionRows(collectionKey, options = {}) {
  const config = getCollectionConfig(collectionKey);
  if (!config) {
    throw new Error(`Unknown collection: ${collectionKey}`);
  }

  if (hasSupabaseAdminConfig()) {
    const dbRows = await listRowsFromDatabase(collectionKey, config, options);
    if (dbRows && (dbRows.length > 0 || options.admin)) {
      return dbRows;
    }
  }

  return getFallbackCollection(collectionKey);
}

export async function getCollectionRow(collectionKey, routeId, options = {}) {
  const config = getCollectionConfig(collectionKey);
  if (!config) {
    throw new Error(`Unknown collection: ${collectionKey}`);
  }

  if (hasSupabaseAdminConfig()) {
    const dbRow = await getRowFromDatabase(collectionKey, config, routeId);
    if (dbRow || options.databaseOnly) {
      return dbRow;
    }
  }

  return getFallbackCollectionItem(collectionKey, routeId);
}

export async function getDashboardStats() {
  if (!hasSupabaseAdminConfig()) {
    return {
      source: "fallback",
      counts: getFallbackStats(),
    };
  }

  const counts = {};
  for (const collection of listCollectionConfigs()) {
    const rows = await listRowsFromDatabase(collection.key, collection, { admin: true });
    counts[collection.key] = rows?.length || 0;
  }

  return {
    source: "database",
    counts,
  };
}

export async function getLibrarySnapshot() {
  const [dailyTopics, medicalSections, procedures, drillItems, scenarios, listeningLessons] =
    await Promise.all([
      listCollectionRows("dailyTopics"),
      listCollectionRows("medicalSections"),
      listCollectionRows("procedures"),
      listCollectionRows("drillItems"),
      listCollectionRows("scenarios"),
      listCollectionRows("listeningLessons"),
    ]);

  return {
    dailyTopics,
    medicalSections,
    procedures,
    drillItems,
    scenarios,
    listeningLessons,
  };
}

