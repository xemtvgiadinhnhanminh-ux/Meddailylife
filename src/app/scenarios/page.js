import { listCollectionRows } from "@/lib/content-store";

export const metadata = {
  title: "Scenarios | MedSpeak Web",
};

export default async function ScenariosPage() {
  const scenarios = await listCollectionRows("scenarios");

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <span className="eyebrow">Roleplay design</span>
        <h1 className="section-title mt-4">AI scenario library</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Hien tai trang nay tap trung vao quan ly scenario va script mo dau.
          Khi ban chot provider AI ve sau, minh se noi them chat real-time vao
          bo scenario nay ma khong phai viet lai noi dung.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {scenarios.map((scenario) => (
          <article key={scenario.slug} className="section-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{scenario.icon}</span>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">{scenario.title}</h2>
                  <div className="mt-1 text-sm text-slate-500">{scenario.level}</div>
                </div>
              </div>
              <span className="pill">scenario</span>
            </div>

            <p className="mt-4 prose-muted">{scenario.description}</p>

            {scenario.hint ? (
              <div className="mt-4 rounded-[1.5rem] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                <strong className="text-slate-900">Hint:</strong> {scenario.hint}
              </div>
            ) : null}

            {scenario.opening_line ? (
              <div className="mt-4 rounded-[1.5rem] border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-700">
                <strong className="text-slate-900">Opening line:</strong> {scenario.opening_line}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}

