import { notFound } from "next/navigation";

import { SpeakButton } from "@/components/speak-button";
import { getCollectionRow } from "@/lib/content-store";

export default async function ProcedureDetailPage({ params }) {
  const { slug } = await params;
  const procedure = await getCollectionRow("procedures", slug);

  if (!procedure) {
    notFound();
  }

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-4xl">{procedure.icon}</span>
          <div>
            <span className="eyebrow">Procedure</span>
            <h1 className="section-title mt-4 text-4xl">{procedure.title}</h1>
            <p className="mt-2 text-base text-slate-500">{procedure.vn_title}</p>
          </div>
        </div>
      </section>

      <section className="section-card p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-950">Procedure steps</h2>
          <span className="pill">{procedure.steps.length} steps</span>
        </div>

        <div className="mt-6 space-y-4">
          {procedure.steps.map((step, index) => (
            <div key={step.id || index} className="rounded-[1.5rem] border border-slate-200 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step {index + 1}
              </div>
              <div className="mt-2 text-xl font-semibold text-slate-950">{step.en}</div>
              <div className="mt-2 text-sm leading-7 text-slate-600">{step.vn}</div>
              <div className="mt-4">
                <SpeakButton text={step.en} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

