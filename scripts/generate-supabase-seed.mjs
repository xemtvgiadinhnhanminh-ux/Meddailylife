import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const legacyDir = path.join(rootDir, "legacy-data");
const outputDir = path.join(rootDir, "supabase");
const outputFile = path.join(outputDir, "seed.sql");

const scenarioOpeners = {
  "new-patient": "Hello, doctor. I've been having this really bad ear pain for a few days now...",
  "child-nose": "Doctor! Please help! My daughter put something in her nose, I don't know what to do!",
  "hearing-loss": "Good morning, doctor. My children keep saying I can't hear properly. I think my hearing is getting worse...",
  "post-op": "Hello doctor, I'm here for my follow-up after the sinus surgery. I think I'm doing better.",
  "foreigner-tourist": "Hi, I hope you speak English! I'm having a problem with my ear since my flight landed...",
  colleague: "Hello there! I don't think we've met. I'm James Wilson from Manchester. Great conference so far, isn't it?",
};

function readJson(...segments) {
  return JSON.parse(readFileSync(path.join(legacyDir, ...segments), "utf8"));
}

function sqlString(value) {
  const raw = value === null || value === undefined ? "" : String(value);
  return `'${raw.replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return sqlString(JSON.stringify(value ?? []));
}

function buildCollections() {
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
      section_type: "consultation",
      slug: `consultation-${slug}`,
      title: item.label,
      subtitle: "Khung câu hỏi cho khám bệnh và khai thác triệu chứng.",
      phrases: item.phrases,
      sort_order: index,
      published: true,
    })),
    ...Object.entries(conference).map(([slug, item], index) => ({
      section_type: "conference",
      slug: `conference-${slug}`,
      title: item.label,
      subtitle: "Ngôn ngữ hội nghị và giao tiếp chuyên môn.",
      phrases: item.phrases,
      sort_order: index + 100,
      published: true,
    })),
    {
      section_type: "medication",
      slug: "medication-core",
      title: "Medication Instructions",
      subtitle: "Huong dan thuoc thong dung cho benh nhan.",
      phrases: medication,
      sort_order: 200,
      published: true,
    },
    ...Object.entries(dailyPhrases).map(([slug, item], index) => ({
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
    slug: item.id,
    title: item.name,
    vn_title: item.vn,
    icon: item.icon,
    steps: item.steps,
    sort_order: index,
    published: true,
  }));

  const drillItems = drillPool.map((item, index) => ({
    legacy_id: item.id,
    category: item.category || "general",
    english: item.en,
    vietnamese: item.vn,
    note: item.note || "",
    sort_order: index,
    published: true,
  }));

  const scenarioItems = scenarios.map((item, index) => ({
    slug: item.id,
    title: item.title,
    icon: item.icon,
    level: item.level,
    description: item.desc || "",
    hint: item.hint || "",
    system_prompt: item.systemPrompt || "",
    opening_line: scenarioOpeners[item.id] || "",
    sort_order: index,
    published: true,
  }));

  const lessonItems = listeningLessons.map((item, index) => ({
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

function insertStatement(table, columns, rows) {
  if (!rows.length) {
    return `-- ${table}: no rows`;
  }

  const valueRows = rows
    .map((row) => {
      const values = columns.map((column) => {
        const value = row[column];
        if (typeof value === "boolean") return value ? "true" : "false";
        if (typeof value === "number") return String(value);
        if (Array.isArray(value) || (value && typeof value === "object")) return sqlJson(value);
        return sqlString(value);
      });

      return `(${values.join(", ")})`;
    })
    .join(",\n");

  return `insert into ${table} (${columns.join(", ")}) values\n${valueRows};`;
}

const collections = buildCollections();

const sql = `
truncate table listening_lessons, scenarios, drill_items, procedures, medical_sections, daily_topics restart identity cascade;

${insertStatement(
  "daily_topics",
  [
    "slug",
    "title",
    "vn_title",
    "icon",
    "color",
    "description",
    "phrases",
    "vocab",
    "tips",
    "dialogue",
    "sort_order",
    "published",
  ],
  collections.dailyTopics
)}

${insertStatement(
  "medical_sections",
  ["section_type", "slug", "title", "subtitle", "phrases", "sort_order", "published"],
  collections.medicalSections
)}

${insertStatement(
  "procedures",
  ["slug", "title", "vn_title", "icon", "steps", "sort_order", "published"],
  collections.procedures
)}

${insertStatement(
  "drill_items",
  ["legacy_id", "category", "english", "vietnamese", "note", "sort_order", "published"],
  collections.drillItems
)}

${insertStatement(
  "scenarios",
  ["slug", "title", "icon", "level", "description", "hint", "system_prompt", "opening_line", "sort_order", "published"],
  collections.scenarios
)}

${insertStatement(
  "listening_lessons",
  ["slug", "title", "source", "level", "duration", "transcript", "connected_speech", "vocab", "quiz", "sort_order", "published"],
  collections.listeningLessons
)}`.trim();

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, `${sql}\n`, "utf8");

console.log(`Generated ${outputFile}`);

