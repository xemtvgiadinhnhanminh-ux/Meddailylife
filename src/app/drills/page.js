import { DrillTrainer } from "@/components/drills/drill-trainer";
import { listCollectionRows } from "@/lib/content-store";

export const metadata = {
  title: "Drills | MedSpeak Web",
};

export default async function DrillsPage() {
  const drills = await listCollectionRows("drillItems");

  return (
    <main className="content-shell space-y-6">
      <section className="hero-card px-8 py-10 lg:px-12">
        <span className="eyebrow">Practice loop</span>
        <h1 className="section-title mt-4">Speaking drills</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Ban web nay giu lai y tuong drills cua app cu nhung chuyen sang kieu
          module web de de them phrase moi qua admin.
        </p>
      </section>

      <DrillTrainer items={drills} />
    </main>
  );
}

