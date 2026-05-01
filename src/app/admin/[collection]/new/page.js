import { notFound } from "next/navigation";

import { ContentForm } from "@/components/admin/content-form";
import { getCollectionConfig } from "@/lib/content-config";
import { hasSupabaseAdminConfig } from "@/lib/env";

export default async function AdminNewItemPage({ params, searchParams }) {
  const { collection } = await params;
  const query = await searchParams;
  const config = getCollectionConfig(collection);

  if (!config) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Them moi · {config.label}
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Tao noi dung moi voi schema da duoc chuan hoa cho ban web.
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <ContentForm
          collection={config}
          item={config.emptyValue}
          routeId="new"
          readOnly={!hasSupabaseAdminConfig()}
          error={query?.error || ""}
          message={query?.message || ""}
        />
      </div>
    </div>
  );
}

