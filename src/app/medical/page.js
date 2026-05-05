import { SpeakButton } from "@/components/speak-button";
import { listCollectionRows } from "@/lib/content-store";

const GROUP_LABELS = {
  consultation: "Consultation",
  conference: "Conference",
  medication: "Medication",
  medical_daily: "Medical Daily Phrases",
};

export const metadata = {
  title: "Medical English | MedSpeak Web",
};

export default async function MedicalPage() {
  const sections = await listCollectionRows("medicalSections");

  const groupedSections = sections.reduce((result, section) => {
    const groupKey = section.section_type || "other";
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(section);
    return result;
  }, {});

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <span className="eyebrow">Medical communication</span>
        <h1 className="section-title mt-4">Medical English modules</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Nội dung y khoa được tách theo nhóm rõ ràng để sau này bạn dễ mở rộng
          trong admin, không bị đóng cứng trong một file JS lớn.
        </p>
      </section>

      {Object.entries(groupedSections).map(([groupKey, groupItems]) => (
        <section key={groupKey} className="section-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">{GROUP_LABELS[groupKey] || groupKey}</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                {GROUP_LABELS[groupKey] || groupKey}
              </h2>
            </div>
            <span className="pill">{groupItems.length} section</span>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {groupItems.map((section) => (
              <div key={section.id} className="rounded-[1.75rem] border border-slate-200 p-6">
                <h3 className="text-2xl font-semibold text-slate-950">{section.title}</h3>
                <p className="mt-2 prose-muted">{section.subtitle}</p>
                <div className="mt-5 space-y-3">
                  {section.phrases.slice(0, 5).map((phrase, index) => (
                    <div
                      key={phrase.id || index}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="text-base font-medium text-slate-950">{phrase.en}</div>
                      <div className="mt-2 text-sm leading-7 text-slate-600">{phrase.vn}</div>
                      <div className="mt-3">
                        <SpeakButton text={phrase.en} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

