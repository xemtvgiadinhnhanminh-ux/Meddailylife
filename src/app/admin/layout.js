import Link from "next/link";

import { signOutAction } from "@/app/auth/actions";
import { SetupNotice } from "@/components/setup-notice";
import { listCollectionConfigs } from "@/lib/content-config";
import { getViewerContext } from "@/lib/admin-access";
import { hasSupabaseAdminConfig } from "@/lib/env";

export default async function AdminLayout({ children }) {
  const viewer = await getViewerContext();

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 py-8 lg:py-10">
      <aside className="hidden w-72 shrink-0 flex-col gap-4 lg:flex">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            MedSpeak Web
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Khu quản trị nội dung deploy lên Vercel.
          </p>
        </div>

        <nav className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Collections
          </div>
          <div className="space-y-1">
            <Link
              href="/admin"
              className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Tổng quan
            </Link>
            {listCollectionConfigs().map((collection) => (
              <Link
                key={collection.key}
                href={`/admin/${collection.key}`}
                className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {collection.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">
            {viewer.profile?.display_name || "Admin"}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {viewer.profile?.email || "Setup mode"}
          </div>

          {hasSupabaseAdminConfig() && viewer.profile?.role === "admin" ? (
            <form action={signOutAction} className="mt-4">
              <button
                type="submit"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Đăng xuất
              </button>
            </form>
          ) : null}
        </div>
      </aside>

      <main className="min-w-0 flex-1 space-y-6">
        {!hasSupabaseAdminConfig() ? <SetupNotice compact /> : null}
        {children}
      </main>
    </div>
  );
}

