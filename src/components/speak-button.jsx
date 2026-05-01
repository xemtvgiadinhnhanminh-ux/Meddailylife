"use client";

export function SpeakButton({
  text,
  label = "Nghe",
  className = "",
  rate = 0.88,
}) {
  function handleSpeak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 ${className}`}
    >
      {label}
    </button>
  );
}

