import { readFileSync } from "node:fs";
import path from "node:path";

const SCENARIO_OPENERS = {
  "new-patient": "Hello, doctor. I've been having this really bad ear pain for a few days now...",
  "child-nose": "Doctor! Please help! My daughter put something in her nose, I don't know what to do!",
  "hearing-loss": "Good morning, doctor. My children keep saying I can't hear properly. I think my hearing is getting worse...",
  "post-op": "Hello doctor, I'm here for my follow-up after the sinus surgery. I think I'm doing better.",
  "foreigner-tourist": "Hi, I hope you speak English! I'm having a problem with my ear since my flight landed...",
  colleague: "Hello there! I don't think we've met. I'm James Wilson from Manchester. Great conference so far, isn't it?",
};

let fallbackCache = null;

function readJson(...segments) {
  const filePath = path.join(process.cwd(), "legacy-data", ...segments);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function buildFallbackCollections() {
  const consultation = readJson("medical", "consultation.json");
  const procedures = readJson("medical", "procedures.json");
  const medication = readJson("medical", "medication.json");
  const conference = readJson("medical", "conference.json");
  const dailyPhrases = readJson("medical", "daily-phrases.json");
  const scenarios = readJson("medical", "scenarios.json");
  const dailyTopicsSource = readJson("daily-life", "topics.json");
  const drillPool = readJson("drill-pool.json");
  const listeningLessons = readJson("voa-bbc", "manifest.json");

  const dailyTopics = Object.values(dailyTopicsSource).map((topic, index) => ({
    id: topic.id,
    slug: topic.id,
    title: topic.title,
    vn_title: topic.vn,
    icon: topic.icon,
    color: topic.color,
    description: `${topic.phrases.length} phrases · ${topic.vocab.length} vocab items`,
    phrases: topic.phrases,
    vocab: topic.vocab || [],
    tips: topic.tips || [],
    dialogue: topic.dialogue || [],
    sort_order: index,
    published: true,
  }));

  const medicalSections = [
    ...Object.entries(consultation).map(([slug, item], index) => ({
      id: `consultation-${slug}`,
      section_type: "consultation",
      slug: `consultation-${slug}`,
      title: item.label,
      subtitle: "Khung câu hỏi cho khám bệnh và khai thác triệu chứng.",
      phrases: item.phrases,
      sort_order: index,
      published: true,
    })),
    ...Object.entries(conference).map(([slug, item], index) => ({
      id: `conference-${slug}`,
      section_type: "conference",
      slug: `conference-${slug}`,
      title: item.label,
      subtitle: "Ngôn ngữ hội nghị và giao tiếp chuyên môn.",
      phrases: item.phrases,
      sort_order: index + 100,
      published: true,
    })),
    {
      id: "medication-core",
      section_type: "medication",
      slug: "medication-core",
      title: "Medication Instructions",
      subtitle: "Huong dan thuoc thong dung cho benh nhan.",
      phrases: medication,
      sort_order: 200,
      published: true,
    },
    ...Object.entries(dailyPhrases).map(([slug, item], index) => ({
      id: `medical-daily-${slug}`,
      section_type: "medical_daily",
      slug: `medical-daily-${slug}`,
      title: item.label,
      subtitle: "Cum giao tiep nhanh co the dung ngay trong phong kham.",
      phrases: item.phrases,
      sort_order: index + 300,
      published: true,
    })),
  ];

  const procedureItems = procedures.map((item, index) => ({
    id: item.id,
    slug: item.id,
    title: item.name,
    vn_title: item.vn,
    icon: item.icon,
    steps: item.steps,
    sort_order: index,
    published: true,
  }));

  const drillItems = drillPool.map((item, index) => ({
    id: item.id,
    legacy_id: item.id,
    category: item.category || "general",
    english: item.en,
    vietnamese: item.vn,
    note: item.note || "",
    sort_order: index,
    published: true,
  }));

  const scenarioItems = scenarios.map((item, index) => ({
    id: item.id,
    slug: item.id,
    title: item.title,
    icon: item.icon,
    level: item.level,
    description: item.desc || "",
    hint: item.hint || "",
    system_prompt: item.systemPrompt || "",
    opening_line: SCENARIO_OPENERS[item.id] || "",
    sort_order: index,
    published: true,
  }));

  const lessonItems = listeningLessons.map((item, index) => ({
    id: item.id,
    slug: item.id,
    title: item.title,
    source: item.source,
    level: item.level,
    duration: item.duration,
    transcript: item.transcript || [],
    connected_speech: item.connected_speech || [],
    vocab: item.vocab || [],
    quiz: item.quiz || [],
    sort_order: index,
    published: true,
  }));

  return {
    dailyTopics,
    medicalSections,
    procedures: procedureItems,
    drillItems,
    scenarios: scenarioItems,
    listeningLessons: lessonItems,
  };
}

export function getFallbackCollections() {
  if (!fallbackCache) {
    fallbackCache = buildFallbackCollections();
  }

  return structuredClone(fallbackCache);
}

export function getFallbackCollection(collectionKey) {
  const collections = getFallbackCollections();
  return collections[collectionKey] || [];
}

export function getFallbackCollectionItem(collectionKey, routeId) {
  return getFallbackCollection(collectionKey).find((item) =>
    [item.id, item.slug, item.legacy_id].filter(Boolean).includes(routeId)
  );
}

export function getFallbackStats() {
  const collections = getFallbackCollections();

  return {
    dailyTopics: collections.dailyTopics.length,
    medicalSections: collections.medicalSections.length,
    procedures: collections.procedures.length,
    drillItems: collections.drillItems.length,
    scenarios: collections.scenarios.length,
    listeningLessons: collections.listeningLessons.length,
  };
}

