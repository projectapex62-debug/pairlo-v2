import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight, RotateCcw, ArrowRight, Star } from "lucide-react";
import { allPairs } from "../lib/mock-data";

const QUESTIONS = [
  {
    id: "vibe",
    question: "What's your ideal travel vibe?",
    options: [
      { label: "🏖️ Beach & Laid-back", value: "beach" },
      { label: "🏔️ Mountains & Adventure", value: "mountain" },
      { label: "🌆 City & Culture", value: "city" },
      { label: "🌴 Tropical & Luxe", value: "luxe" },
    ],
  },
  {
    id: "car",
    question: "Your dream road trip car?",
    options: [
      { label: "🏎️ Sports car — let's go fast", value: "sports" },
      { label: "🚙 SUV — comfort is king", value: "suv" },
      { label: "⚡ EV — eco & sleek", value: "ev" },
      { label: "🤠 Offroad — adventure ready", value: "offroad" },
    ],
  },
  {
    id: "group",
    question: "Who are you traveling with?",
    options: [
      { label: "💑 Just the two of us", value: "couple" },
      { label: "👨‍👩‍👧 Family trip", value: "family" },
      { label: "👯 Friends squad", value: "friends" },
      { label: "🧳 Flying solo", value: "solo" },
    ],
  },
  {
    id: "budget",
    question: "What's your per-night budget?",
    options: [
      { label: "💸 Under $300", value: "budget" },
      { label: "💰 $300–$500", value: "mid" },
      { label: "💎 $500–$800", value: "premium" },
      { label: "🔥 Whatever it takes", value: "ultra" },
    ],
  },
];

// Scoring: each answer maps to a pair id
const SCORE_MAP: Record<string, Record<string, string[]>> = {
  vibe: {
    beach: ["pair-1", "pair-6"],
    mountain: ["pair-2"],
    city: ["pair-3", "pair-5"],
    luxe: ["pair-4", "pair-6"],
  },
  car: {
    sports: ["pair-6", "pair-5"],
    suv: ["pair-2", "pair-4"],
    ev: ["pair-3", "pair-5"],
    offroad: ["pair-2"],
  },
  group: {
    couple: ["pair-6", "pair-1"],
    family: ["pair-4", "pair-2"],
    friends: ["pair-3", "pair-5"],
    solo: ["pair-5", "pair-1"],
  },
  budget: {
    budget: ["pair-3"],
    mid: ["pair-2", "pair-1"],
    premium: ["pair-4", "pair-6"],
    ultra: ["pair-5", "pair-6"],
  },
};

function getPairMatch(answers: Record<string, string>) {
  const scores: Record<string, number> = {};
  allPairs.forEach((p) => (scores[p.id] = 0));

  Object.entries(answers).forEach(([qid, val]) => {
    const matches = SCORE_MAP[qid]?.[val] ?? [];
    matches.forEach((id) => (scores[id] = (scores[id] ?? 0) + 1));
  });

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return allPairs.find((p) => p.id === best) ?? allPairs[0];
}

const PROGRESS_COLORS = ["#8A9E7B", "#8A9E7B", "#A8BB9C", "#A8BB9C"];

export default function Quiz() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<number>(0); // 0 = intro, 1-4 = questions, 5 = result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const qIdx = step - 1;
  const question = QUESTIONS[qIdx];
  const progress = step <= 4 ? (step / QUESTIONS.length) * 100 : 100;
  const result = step === 5 ? getPairMatch(answers) : null;

  const handleAnswer = (val: string) => {
    if (animating) return;
    setSelected(val);
    setAnimating(true);
    setTimeout(() => {
      const newAnswers = { ...answers, [question.id]: val };
      setAnswers(newAnswers);
      setSelected(null);
      setAnimating(false);
      setStep((s) => s + 1);
    }, 320);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
  };

  const grandTotal = result
    ? result.stay.price * result.totalNights + result.car.price * result.totalDays
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)", paddingTop: "72px", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ background: "var(--color-black)", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
            Quiz · What's Your Pair Style?
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 500, color: "white", letterSpacing: "0.01em" }}>
            {step === 0 ? "Find your perfect pair" : step === 5 ? "Your perfect match" : `Question ${step} of ${QUESTIONS.length}`}
          </h1>
        </div>
      </div>

      {/* Progress bar */}
      {step > 0 && step <= 4 && (
        <div style={{ height: "4px", background: "var(--color-gray-200)" }}>
          <div style={{ height: "100%", background: "var(--color-mocha)", width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "580px" }}>

          {/* INTRO */}
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "24px" }}>🗺️</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 500, color: "var(--color-black)", marginBottom: "16px" }}>
                4 questions. 1 perfect trip.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-gray-500)", marginBottom: "40px", lineHeight: 1.7 }}>
                Tell us your vibe and we'll match you with the stay + car pair made for you.
              </p>
              <button
                onClick={() => setStep(1)}
                style={{ background: "var(--color-mocha)", color: "white", border: "none", padding: "16px 48px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: "10px", transition: "background 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-mocha)")}
              >
                START QUIZ <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* QUESTION */}
          {step >= 1 && step <= 4 && (
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
                transition: "all 0.25s ease",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, color: "var(--color-black)", marginBottom: "32px", textAlign: "center", lineHeight: 1.3 }}>
                {question.question}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {question.options.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      style={{
                        background: isSelected ? "var(--color-mocha)" : "var(--color-cream)",
                        color: isSelected ? "white" : "var(--color-black)",
                        border: `2px solid ${isSelected ? "var(--color-mocha)" : "var(--color-gray-200)"}`,
                        borderRadius: "4px",
                        padding: "20px 16px",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                        lineHeight: 1.4,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)";
                          (e.currentTarget as HTMLElement).style.background = "var(--color-mocha-pale)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-200)";
                          (e.currentTarget as HTMLElement).style.background = "var(--color-cream)";
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Skip */}
              {step > 1 && (
                <p
                  onClick={() => setStep((s) => s - 1)}
                  style={{ textAlign: "center", marginTop: "24px", fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-400)", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-gray-600)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-gray-400)")}
                >
                  ← Go back
                </p>
              )}
            </div>
          )}

          {/* RESULT */}
          {step === 5 && result && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-mocha)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                Your match
              </p>

              {/* Card */}
              <div style={{ background: "var(--color-cream)", border: "1px solid var(--color-gray-200)", borderRadius: "6px", overflow: "hidden", marginBottom: "24px", textAlign: "left" }}>
                <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                  <img src={result.stay.image} alt={result.stay.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,46,31,0.8) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 500, color: "white" }}>{result.stay.name}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{result.stay.location}</p>
                  </div>
                  <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(27,46,31,0.7)", backdropFilter: "blur(6px)", borderRadius: "20px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Star size={11} color="#F4C056" fill="#F4C056" />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, color: "white" }}>{result.stay.rating}</span>
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--color-black)", marginBottom: "4px" }}>
                        {result.car.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gray-500)" }}>
                        {result.totalNights} nights · {result.totalDays} days
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 500, color: "var(--color-black)" }}>
                        ${grandTotal.toLocaleString()}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-gray-400)" }}>total bundle</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/checkout?pair=${result.id}&nights=${result.totalNights}&days=${result.totalDays}`)}
                    style={{ width: "100%", background: "var(--color-mocha)", color: "white", border: "none", padding: "14px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    BOOK THIS PAIR <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              <button
                onClick={reset}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid var(--color-gray-300)", color: "var(--color-gray-500)", padding: "10px 20px", borderRadius: "2px", fontFamily: "var(--font-body)", fontSize: "12px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mocha)"; (e.currentTarget as HTMLElement).style.color = "var(--color-mocha)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-gray-300)"; (e.currentTarget as HTMLElement).style.color = "var(--color-gray-500)"; }}
              >
                <RotateCcw size={12} /> RETAKE QUIZ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
