import { notFound } from "next/navigation";

import { SpeakButton } from "@/components/speak-button";
import { getCollectionRow } from "@/lib/content-store";

export default async function TopicDetailPage({ params }) {
  const { slug } = await params;
  const topic = await getCollectionRow("dailyTopics", slug);

  if (!topic) {
    notFound();
  }

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-4xl">{topic.icon}</span>
          <div>
            <span className="eyebrow">Daily topic</span>
            <h1 className="section-title mt-4 text-4xl">{topic.title}</h1>
            <p className="mt-2 text-base text-slate-500">{topic.vn_title}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="section-card p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-950">Key phrases</h2>
              <span className="pill">{topic.phrases.length} muc</span>
            </div>
            <div className="mt-6 space-y-4">
              {topic.phrases.map((phrase, index) => (
                <div key={phrase.id || index} className="rounded-[1.5rem] border border-slate-200 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Phrase {index + 1}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-slate-950">{phrase.en}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{phrase.vn}</div>
                  {phrase.note ? (
                    <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {phrase.note}
                    </div>
                  ) : null}
                  <div className="mt-4">
                    <SpeakButton text={phrase.en} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Sample dialogue</h2>
            <div className="mt-6 space-y-4">
              {topic.dialogue.map((line, index) => (
                <div key={`${line.speaker}-${index}`} className="rounded-[1.5rem] border border-slate-200 p-5">
                  <div className="text-sm font-semibold text-slate-500">{line.speaker}</div>
                  <div className="mt-2 text-lg font-medium text-slate-950">{line.en}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{line.vn}</div>
                  <div className="mt-4">
                    <SpeakButton text={line.en} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-card p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Vocabulary</h2>
            <div className="mt-6 space-y-3">
              {topic.vocab.map((item, index) => (
                <div key={`${item.word}-${index}`} className="rounded-[1.5rem] border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-950">{item.word}</span>
                    <span className="text-sm text-slate-500">{item.phonetic}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{item.meaning}</div>
                  <div className="mt-3">
                    <SpeakButton text={item.word} label="Phat am" rate={0.78} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Communication tips</h2>
            <div className="mt-6 space-y-3">
              {topic.tips.map((tip, index) => (
                <div key={index} className="rounded-[1.5rem] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

