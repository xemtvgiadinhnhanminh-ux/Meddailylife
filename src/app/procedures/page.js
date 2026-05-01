import Link from "next/link";

import { listCollectionRows } from "@/lib/content-store";

export const metadata = {
  title: "Procedures | MedSpeak Web",
};

export default async function ProceduresPage() {
  const procedures = await listCollectionRows("procedures");

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <span className="eyebrow">ENT procedures</span>
        <h1 className="section-title mt-4">Procedure library</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Moi thu thuat duoc tach thanh mot record rieng, de admin co the them
          procedure moi, sua step, hoac doi trinh tu thao tac bat cu luc nao.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {procedures.map((procedure) => (
          <Link
            key={procedure.slug}
            href={`/procedures/${procedure.slug}`}
            className="section-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-3xl">{procedure.icon}</span>
              <span className="pill">{procedure.steps.length} steps</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{procedure.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{procedure.vn_title}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

