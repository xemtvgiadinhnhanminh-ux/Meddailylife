import Link from "next/link";

import { loginAction, signUpAction } from "@/app/auth/actions";
import { hasSupabaseAdminConfig } from "@/lib/env";

export const metadata = {
  title: "Admin Login | MedSpeak Web",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const nextPath = params?.next || "/admin";
  const error = params?.error || "";
  const message = params?.message || "";
  const reason = params?.reason || "";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl items-center px-6 py-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Admin access
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            Quan ly noi dung MedSpeak tren web
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Khu nay danh cho tai khoan quan tri de them chu de moi, sua lesson,
            them drills va mo rong noi dung ma khong can sua tay trong code.
          </p>

          {reason === "forbidden" ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Tai khoan nay da dang nhap, nhung chua duoc gan quyen admin.
              Hãy them email cua ban vao `ADMIN_EMAILS` va dang nhap lai.
            </div>
          ) : null}

          {!hasSupabaseAdminConfig() ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">
              Supabase chua duoc ket noi, nen form dang nhap hien tai chua the
              luu session that. Sau khi ban tao Supabase project va dien `.env`,
              khu admin se hoat dong day du tren Vercel.
            </div>
          ) : null}

          <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-6 text-slate-100">
            <h2 className="text-lg font-semibold">Quyen quan tri da duoc thiet ke san</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Email nam trong `ADMIN_EMAILS` se tu dong duoc nang quyen `admin`.</li>
              <li>Admin co the CRUD daily topics, procedures, drills, lessons va scenarios.</li>
              <li>Nguoi hoc thong thuong chi xem noi dung, khong sua duoc.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Dang nhap
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Dung email ma ban muon gan quyen admin.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {message}
            </div>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Dang nhap vao admin
            </button>
          </form>

          <form action={signUpAction} className="mt-4">
            <input type="hidden" name="email" value="" readOnly />
            <input type="hidden" name="password" value="" readOnly />
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            Muon tao user moi? Ban co the tao tai khoan trong Supabase Auth, hoac
            doi form nay thanh self sign-up sau khi da xac nhan chinh sach admin.
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            ← Quay lai trang hoc
          </Link>
        </section>
      </div>
    </div>
  );
}

