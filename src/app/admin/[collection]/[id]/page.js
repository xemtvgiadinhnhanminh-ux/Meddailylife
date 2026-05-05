import { notFound } from "next/navigation";

import { ContentForm } from "@/components/admin/content-form";
import { getCollectionConfig } from "@/lib/content-config";
import { getCollectionRow } from "@/lib/content-store";
import { hasSupabaseAdminConfig } from "@/lib/env";

export default async function AdminEditItemPage({ params, searchParams }) {
  const { collection, id } = await params;
  const query = await searchParams;
  const config = getCollectionConfig(collection);

  if (!config) {
    notFound();
  }

  const item = await getCollectionRow(collection, id, { admin: true });
  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Chỉnh sửa · {config.label}
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Bản ghi đang mở: <span className="font-medium text-slate-950">{item.title || item.slug || item.legacy_id || item.id}</span>
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <ContentForm
          collection={config}
          item={item}
          routeId={id}
          readOnly={!hasSupabaseAdminConfig()}
          error={query?.error || ""}
          message={query?.message || ""}
        />
      </div>
    </div>
  );
}
