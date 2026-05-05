import Link from "next/link";

import { listCollectionRows } from "@/lib/content-store";

export const metadata = {
  title: "Daily Topics | MedSpeak Web",
};

export default async function TopicsPage() {
  const topics = await listCollectionRows("dailyTopics");

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <span className="eyebrow">Daily life</span>
        <h1 className="section-title mt-4">Daily Topics</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Chọn một tình huống cụ thể, nghe phrase, đọc vocab và xem dialogue mẫu
          để luyện cách giao tiếp tự nhiên hơn.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="section-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-3xl">{topic.icon}</span>
              <span className="pill">{topic.phrases.length} phrases</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              {topic.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{topic.vn_title}</p>
            <p className="mt-4 prose-muted">{topic.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

