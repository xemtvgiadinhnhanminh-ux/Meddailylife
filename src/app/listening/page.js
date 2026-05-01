import { SpeakButton } from "@/components/speak-button";
import { listCollectionRows } from "@/lib/content-store";

export const metadata = {
  title: "Listening | MedSpeak Web",
};

export default async function ListeningPage() {
  const lessons = await listCollectionRows("listeningLessons");

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <span className="eyebrow">Listening lab</span>
        <h1 className="section-title mt-4">VOA / BBC lessons</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Mỗi lesson duoc luu thanh mot record rieng de ban co the them transcript,
          vocab, connected speech va quiz moi ngay trong admin.
        </p>
      </section>

      <section className="space-y-6">
        {lessons.map((lesson) => (
          <article key={lesson.slug} className="section-card p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <span>{lesson.source}</span>
                  <span>•</span>
                  <span>{lesson.level}</span>
                  <span>•</span>
                  <span>{lesson.duration}</span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  {lesson.title}
                </h2>
              </div>
              <span className="pill">{lesson.quiz.length} quiz items</span>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-950">Transcript</h3>
                {lesson.transcript.map((line, index) => (
                  <div key={index} className="rounded-[1.5rem] border border-slate-200 p-4">
                    <div className="text-base font-medium text-slate-950">{line.text}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-600">{line.vn}</div>
                    <div className="mt-3">
                      <SpeakButton text={line.text} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Connected speech</h3>
                  <div className="mt-4 space-y-3">
                    {lesson.connected_speech.map((item, index) => (
                      <div key={index} className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
                        <div className="font-medium text-slate-900">{item.phrase}</div>
                        <div className="mt-1 text-sm text-slate-600">{item.phenomenon}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Vocabulary</h3>
                  <div className="mt-4 space-y-3">
                    {lesson.vocab.map((item, index) => (
                      <div key={index} className="rounded-[1.5rem] border border-slate-200 p-4">
                        <div className="font-medium text-slate-900">{item.word}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.phonetic}</div>
                        <div className="mt-2 text-sm text-slate-600">{item.meaning}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Quiz preview</h3>
                  <div className="mt-4 space-y-3">
                    {lesson.quiz.map((item, index) => (
                      <div key={index} className="rounded-[1.5rem] border border-slate-200 p-4">
                        <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Question {index + 1}
                        </div>
                        <div className="mt-2 font-medium text-slate-900">{item.question}</div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                          {item.options.map((option, optionIndex) => (
                            <li key={optionIndex}>
                              {optionIndex + 1}. {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
