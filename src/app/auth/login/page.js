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
            Quản lý nội dung MedSpeak trên web
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Khu này dành cho tài khoản quản trị để thêm chủ đề mới, sửa lesson,
            thêm drills và mở rộng nội dung mà không cần sửa tay trong code.
          </p>

          {reason === "forbidden" ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Tài khoản này đã đăng nhập, nhưng chưa được gán quyền admin.
              Hãy thêm email của bạn vào `ADMIN_EMAILS` và đăng nhập lại.
            </div>
          ) : null}

          {!hasSupabaseAdminConfig() ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">
              Supabase chưa được kết nối, nên form đăng nhập hiện tại chưa thể
              lưu session thật. Sau khi bạn tạo Supabase project và điền `.env`,
              khu admin sẽ hoạt động đầy đủ trên Vercel.
            </div>
          ) : null}

          <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-6 text-slate-100">
            <h2 className="text-lg font-semibold">Quyền quản trị đã được thiết kế sẵn</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Email nằm trong `ADMIN_EMAILS` sẽ tự động được nâng quyền `admin`.</li>
              <li>Admin có thể CRUD daily topics, procedures, drills, lessons và scenarios.</li>
              <li>Người học thông thường chỉ xem nội dung, không sửa được.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Dùng email mà bạn muốn gán quyền admin.
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
              Đăng nhập vào admin
            </button>
          </form>

          <form action={signUpAction} className="mt-4">
            <input type="hidden" name="email" value="" readOnly />
            <input type="hidden" name="password" value="" readOnly />
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            Muốn tạo user mới? Bạn có thể tạo tài khoản trong Supabase Auth, hoặc
            đổi form này thành self sign-up sau khi đã xác nhận chính sách admin.
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            ← Quay lại trang học
          </Link>
        </section>
      </div>
    </div>
  );
}

