"use client";

import { useMemo, useState } from "react";

export function DrillTrainer({ items }) {
  const categories = useMemo(() => {
    const values = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return ["all", ...values];
  }, [items]);

  const [category, setCategory] = useState("all");
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const filteredItems = useMemo(() => {
    return category === "all"
      ? items
      : items.filter((item) => item.category === category);
  }, [category, items]);

  const currentItem = filteredItems[index] || null;

  function speak(text, rate = 0.84) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function resetResult() {
    setHeard("");
    setScore(null);
  }

  function updateCategory(nextCategory) {
    setCategory(nextCategory);
    setIndex(0);
    resetResult();
  }

  function shuffleItems() {
    if (!filteredItems.length) return;

    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    setIndex(randomIndex);
    resetResult();
  }

  function nextItem() {
    if (index < filteredItems.length - 1) {
      setIndex(index + 1);
      resetResult();
    }
  }

  function prevItem() {
    if (index > 0) {
      setIndex(index - 1);
      resetResult();
    }
  }

  function startRecognition() {
    if (typeof window === "undefined") return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || !currentItem) {
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const results = Array.from({ length: event.results[0].length }, (_, resultIndex) =>
        event.results[0][resultIndex].transcript.trim().toLowerCase()
      );

      const targetWords = currentItem.english
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);
      const matches = targetWords.filter((word) => results.some((result) => result.includes(word)));
      const nextScore = targetWords.length
        ? Math.round((matches.length / targetWords.length) * 100)
        : 0;

      setHeard(results[0] || "");
      setScore(nextScore);

      if (nextScore >= 60) {
        setCorrect((value) => value + 1);
      } else {
        setWrong((value) => value + 1);
      }
    };

    recognition.start();
  }

  if (!currentItem) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
        Không có drill nào trong category này.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <label className="text-sm font-medium text-slate-700">
          Category
          <select
            value={category}
            onChange={(event) => updateCategory(event.target.value)}
            className="ml-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={shuffleItems}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Ngẫu nhiên
        </button>

        <div className="ml-auto flex gap-4 text-sm text-slate-500">
          <span>Tốt: {correct}</span>
          <span>Cần luyện thêm: {wrong}</span>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-sm text-slate-500">
          {index + 1} / {filteredItems.length}
        </div>
        <p className="mt-4 text-lg leading-8 text-slate-600">{currentItem.vietnamese}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {currentItem.english}
        </h2>

        {currentItem.note ? (
          <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {currentItem.note}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => speak(currentItem.english)}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Nghe
          </button>
          <button
            type="button"
            onClick={startRecognition}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Nói lại
          </button>
        </div>

        {heard ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Bạn vừa nói</div>
            <div className="mt-1 text-base text-slate-900">{heard}</div>
            {score !== null ? (
              <div className="mt-3 text-sm font-medium text-slate-700">
                Mức khớp: {score}% {score >= 60 ? "· Tốt" : "· Cần nhắc lại"}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevItem}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          ← Trước
        </button>
        <button
          type="button"
          onClick={nextItem}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}

