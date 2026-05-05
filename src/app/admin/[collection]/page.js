import Link from "next/link";
import { notFound } from "next/navigation";

import { getCollectionConfig, getCollectionRouteId } from "@/lib/content-config";
import { listCollectionRows } from "@/lib/content-store";
import { hasSupabaseAdminConfig } from "@/lib/env";

export default async function AdminCollectionPage({ params, searchParams }) {
  const { collection } = await params;
  const query = await searchParams;
  const config = getCollectionConfig(collection);

  if (!config) {
    notFound();
  }

  const rows = await listCollectionRows(collection, { admin: true });

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {config.label}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {config.description}
            </p>
          </div>

          <Link
            href={`/admin/${collection}/new`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              hasSupabaseAdminConfig()
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            Thêm mới
          </Link>
        </div>

        {query?.message ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {query.message}
          </div>
        ) : null}

        {query?.error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {query.error}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                {config.listFields.map((field) => (
                  <th
                    key={field}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {field}
                  </th>
                ))}
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={getCollectionRouteId(config, row)} className="border-t border-slate-100">
                  {config.listFields.map((field) => (
                    <td key={field} className="px-5 py-4 text-sm text-slate-700">
                      {typeof row[field] === "boolean"
                        ? row[field]
                          ? "Yes"
                          : "No"
                        : String(row[field] ?? "")}
                    </td>
                  ))}
                  <td className="px-5 py-4 text-sm">
                    <Link
                      href={`/admin/${collection}/${getCollectionRouteId(config, row)}`}
                      className="font-medium text-emerald-700 transition hover:text-emerald-600"
                    >
                      Mở editor
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rows.length ? (
          <div className="px-6 py-8 text-sm text-slate-500">
            Chưa có bản ghi nào trong collection này.
          </div>
        ) : null}
      </div>
    </div>
  );
}

