import Link from "next/link";

import { listCollectionConfigs } from "@/lib/content-config";
import { getDashboardStats } from "@/lib/content-store";

export const metadata = {
  title: "Admin Dashboard | MedSpeak Web",
};

export default async function AdminDashboardPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error || "";
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {stats.source === "database" ? "Supabase live" : "Fallback preview"}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Admin dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Đây là nơi bạn có thể quản lý nội dung học tiếng Anh, bổ sung bài mới,
              sửa phrase, thêm lesson và mở rộng app mà không cần sửa dữ liệu hardcode.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Xem trang học
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {listCollectionConfigs().map((collection) => (
          <Link
            key={collection.key}
            href={`/admin/${collection.key}`}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-medium text-slate-500">{collection.label}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">
              {stats.counts[collection.key] || 0}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

