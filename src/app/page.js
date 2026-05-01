import Link from "next/link";

import { SetupNotice } from "@/components/setup-notice";
import { getLibrarySnapshot, getDashboardStats } from "@/lib/content-store";
import { hasSupabaseAdminConfig } from "@/lib/env";

export default async function HomePage() {
  const [snapshot, stats] = await Promise.all([
    getLibrarySnapshot(),
    getDashboardStats(),
  ]);

  const featuredTopics = snapshot.dailyTopics.slice(0, 4);
  const featuredProcedures = snapshot.procedures.slice(0, 3);
  const featuredLessons = snapshot.listeningLessons.slice(0, 2);

  return (
    <main className="content-shell space-y-8">
      <section className="hero-card overflow-hidden px-8 py-10 lg:px-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="eyebrow">Vercel-ready learning hub</span>
            <h1 className="fancy-title mt-5 max-w-3xl text-5xl leading-[1.02] font-semibold tracking-tight text-slate-950 lg:text-6xl">
              Web hoc tieng Anh rieng cho ban, co admin de mo rong noi dung ve sau.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Ban nay tach khoi app local cu, nhung giu lai toan bo noi dung hoc
              quan trong. Khi gan Supabase, ban se co login + quyen admin + CRUD
              noi dung de deploy len Vercel mot cach sach se.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/topics"
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Bat dau hoc
              </Link>
              <Link
                href="/admin"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Vao admin
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="section-card p-6">
              <div className="text-sm font-medium text-slate-500">Daily topics</div>
              <div className="mt-2 text-4xl font-semibold text-slate-950">
                {stats.counts.dailyTopics || 0}
              </div>
              <p className="mt-3 prose-muted">
                Tinh huong doi thuong co phrases, vocab, tips va dialogue.
              </p>
            </div>
            <div className="section-card p-6">
              <div className="text-sm font-medium text-slate-500">Drill pool</div>
              <div className="mt-2 text-4xl font-semibold text-slate-950">
                {stats.counts.drillItems || 0}
              </div>
              <p className="mt-3 prose-muted">
                Cum tu tong hop de luyen nghe-noi phan xa ngay tren web.
              </p>
            </div>
            <div className="section-card p-6">
              <div className="text-sm font-medium text-slate-500">Source mode</div>
              <div className="mt-2 text-xl font-semibold text-slate-950">
                {stats.source === "database" ? "Supabase live" : "Fallback preview"}
              </div>
              <p className="mt-3 prose-muted">
                {stats.source === "database"
                  ? "Noi dung dang doc truc tiep tu database."
                  : "Dang hien du lieu lay tu file legacy cho den khi ket noi Supabase."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!hasSupabaseAdminConfig() ? <SetupNotice /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            href: "/topics",
            title: "Daily Life",
            text: "12 chu de doi thuong nhu restaurant, airport, hotel va complaints.",
          },
          {
            href: "/medical",
            title: "Medical English",
            text: "Consultation, medication, conference va phrase groups cho bac si TMH.",
          },
          {
            href: "/procedures",
            title: "Procedures",
            text: "Thu thuat y khoa voi tung step de nghe va nhac lai bang web speech.",
          },
          {
            href: "/drills",
            title: "Drills",
            text: "Bo drill web de luyen noi nhanh va giu dong luc hoc moi ngay.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="section-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="pill">Module</div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              {item.title}
            </h2>
            <p className="mt-3 prose-muted">{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Preview</span>
              <h2 className="section-title mt-4 text-3xl">Chu de noi bat</h2>
            </div>
            <Link href="/topics" className="text-sm font-semibold text-emerald-700">
              Xem tat ca →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
              >
                <div className="text-3xl">{topic.icon}</div>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{topic.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{topic.vn_title}</p>
                <p className="mt-3 prose-muted">{topic.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-card p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Procedures</span>
                <h2 className="section-title mt-4 text-3xl">Thao tac nhanh</h2>
              </div>
              <Link href="/procedures" className="text-sm font-semibold text-emerald-700">
                Xem them →
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {featuredProcedures.map((procedure) => (
                <Link
                  key={procedure.slug}
                  href={`/procedures/${procedure.slug}`}
                  className="block rounded-[1.5rem] border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{procedure.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-950">{procedure.title}</div>
                      <div className="text-sm text-slate-500">{procedure.vn_title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="section-card p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Listening</span>
                <h2 className="section-title mt-4 text-3xl">Lesson mau</h2>
              </div>
              <Link href="/listening" className="text-sm font-semibold text-emerald-700">
                Xem tat ca →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {featuredLessons.map((lesson) => (
                <div key={lesson.slug} className="rounded-[1.5rem] border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>{lesson.source}</span>
                    <span>•</span>
                    <span>{lesson.level}</span>
                    <span>•</span>
                    <span>{lesson.duration}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{lesson.title}</h3>
                  <p className="mt-2 prose-muted">
                    {lesson.transcript.length} dong transcript · {lesson.quiz.length} cau quiz
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

