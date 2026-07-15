// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, CloudSun, Droplets, FlaskConical, GlassWater, Timer, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("water-intake-calculator");

const WEATHER_OPTIONS = {
  cool: "Cool / mild",
  normal: "Normal indoor conditions",
  warm: "Warm weather",
  hot: "Hot or humid",
};

const GOALS = {
  general_health: "General Health",
  fat_loss: "Fat Loss",
  muscle_gain: "Muscle Gain",
  performance: "Performance",
};

const WEATHER_ADJUSTMENT = {
  cool: 0,
  normal: 0.2,
  warm: 0.5,
  hot: 0.8,
};

const GOAL_ADJUSTMENT = {
  general_health: 0,
  fat_loss: 0.2,
  muscle_gain: 0.25,
  performance: 0.4,
};

const FAQS = [
  {
    question: "How much water should I drink per day?",
    answer: "A useful baseline is around 30 to 40ml per kilogram of body weight, then more for exercise and heat.",
  },
  {
    question: "Do I need electrolytes every day?",
    answer: "Not always. They are most useful for long sessions, heavy sweating, hot weather or repeated outdoor training.",
  },
  {
    question: "Should I drink more when training outside?",
    answer: "Yes. Warm, humid and outdoor sessions usually increase sweat loss, so extra fluid and electrolytes can help.",
  },
  {
    question: "Can I drink too much water?",
    answer: "Yes. Avoid forcing very large amounts at once. Spread intake across the day and include electrolytes when sweating heavily.",
  },
  {
    question: "Is this medical advice?",
    answer: "No. This calculator is for educational purposes only and is not medical advice.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Water Intake Calculator",
      url: "https://dbworkouts.co.uk/tools/water-intake-calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      publisher: {
        "@type": "Organization",
        name: "DB's Workouts",
        url: "https://dbworkouts.co.uk",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

const initialForm = {
  weight_kg: "",
  exercise_minutes: "",
  weather: "",
  goal: "",
};

function roundLitres(value) {
  return Math.round(value * 10) / 10;
}

function calculateWater(form) {
  const weight = Number(form.weight_kg);
  const exerciseMinutes = Number(form.exercise_minutes);
  const baseline = weight * 0.035;
  const exerciseExtra = (exerciseMinutes / 30) * 0.45;
  const weatherExtra = WEATHER_ADJUSTMENT[form.weather] || 0;
  const goalExtra = GOAL_ADJUSTMENT[form.goal] || 0;
  const total = roundLitres(Math.max(1.8, baseline + exerciseExtra + weatherExtra + goalExtra));
  const extraDuringExercise = roundLitres(exerciseExtra);
  const electrolytes = exerciseMinutes >= 60 || form.weather === "hot" || form.goal === "performance"
    ? "Recommended"
    : exerciseMinutes >= 30 || form.weather === "warm"
      ? "Optional"
      : "Usually not needed";

  return {
    total,
    baseline: roundLitres(baseline),
    extraDuringExercise,
    electrolytes,
    schedule: [
      { time: "Morning", amount: `${roundLitres(total * 0.3)}L`, note: "Start steady before caffeine or training." },
      { time: "Training window", amount: `${Math.max(0.3, extraDuringExercise).toFixed(1)}L`, note: "Sip before, during and after exercise." },
      { time: "Afternoon", amount: `${roundLitres(total * 0.3)}L`, note: "Keep energy and focus stable." },
      { time: "Evening", amount: `${roundLitres(total * 0.2)}L`, note: "Finish gradually rather than all at once." },
    ],
  };
}

function Field({ label, error, children }) {
  return (
    <div>
      <span className="text-sm font-semibold text-zinc-300">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1.5 block text-xs font-medium text-[#D0182E]">{error}</span>}
    </div>
  );
}

function ChoiceButton({ selected, children, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`rounded-lg border px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] ${
        selected ? "border-[#B30018] bg-[#B30018] text-white" : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function NumberInput(props) {
  return (
    <input
      type="number"
      className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none transition-colors focus:border-[#B30018] focus:ring-2 focus:ring-[#B30018]/30"
      {...props}
    />
  );
}

export default function WaterIntakeCalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "Water Intake Calculator | DB's Workouts",
    description: "Calculate your daily water intake, exercise hydration, electrolyte recommendation and hydration schedule with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/water-intake-calculator",
    schema: pageSchema,
  });

  const errors = useMemo(() => ({
    weight_kg: form.weight_kg && (form.weight_kg < 35 || form.weight_kg > 250) ? "Enter 35 to 250 kg." : "",
    exercise_minutes: form.exercise_minutes && (form.exercise_minutes < 0 || form.exercise_minutes > 240) ? "Enter 0 to 240 minutes." : "",
  }), [form.exercise_minutes, form.weight_kg]);

  const isValid = Number(form.weight_kg) >= 35 &&
    Number(form.weight_kg) <= 250 &&
    Number(form.exercise_minutes) >= 0 &&
    Number(form.exercise_minutes) <= 240 &&
    form.exercise_minutes !== "" &&
    form.weather &&
    form.goal;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateWater(form));
    track('tool_calculation', { tool_name: 'water_intake_calculator' });
  };

  const resultCards = results ? [
    { label: "Daily Water Intake", value: `${results.total}L`, helper: "Total daily target", icon: Droplets, progress: 100, tone: "blue" },
    { label: "Extra During Exercise", value: `${results.extraDuringExercise}L`, helper: "Added for training", icon: Timer, progress: Math.min(results.extraDuringExercise * 45, 100), tone: "amber" },
    { label: "Electrolytes", value: results.electrolytes, helper: "Based on heat and training", icon: FlaskConical, progress: results.electrolytes === "Recommended" ? 92 : 58, tone: "red" },
    { label: "Baseline Water", value: `${results.baseline}L`, helper: "Before exercise and heat", icon: GlassWater, progress: 72, tone: "slate" },
  ] : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:pt-12">
        <Link to="/tools" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="DB's Workouts" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-black leading-none text-white">DB's Workouts</p>
            <p className="mt-1 text-[11px] font-medium leading-none text-zinc-500">Fitness Tools</p>
          </div>
        </Link>

        <div className="mt-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B30018]/30 bg-[#B30018]/10 px-3 py-1.5 text-xs font-bold text-[#F0F8FF]">
            <Zap className="h-3.5 w-3.5 text-[#B30018]" aria-hidden="true" />
            Free hydration calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Water Intake Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Calculate your daily water target, exercise hydration, electrolyte needs and a simple drinking schedule.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Hydration Plan</h2>
              <p className="mt-1 text-sm text-zinc-500">Enter your body weight, training time, weather and goal.</p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Weight (kg)" error={errors.weight_kg || (submitted && !form.weight_kg ? "Weight is required." : "")}>
                  <NumberInput aria-label="Weight (kg)" min="35" max="250" value={form.weight_kg} onChange={(event) => updateForm("weight_kg", event.target.value)} />
                </Field>
                <Field label="Exercise minutes" error={errors.exercise_minutes || (submitted && form.exercise_minutes === "" ? "Exercise minutes are required." : "")}>
                  <NumberInput aria-label="Exercise minutes" min="0" max="240" value={form.exercise_minutes} onChange={(event) => updateForm("exercise_minutes", event.target.value)} />
                </Field>
              </div>

              <Field label="Weather" error={submitted && !form.weather ? "Choose weather." : ""}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(WEATHER_OPTIONS).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.weather === key} onClick={() => updateForm("weather", key)}>
                      {label}
                    </ChoiceButton>
                  ))}
                </div>
              </Field>

              <Field label="Goal" error={submitted && !form.goal ? "Choose a goal." : ""}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(GOALS).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.goal === key} onClick={() => updateForm("goal", key)}>
                      {label}
                    </ChoiceButton>
                  ))}
                </div>
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate Water Intake <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your hydration targets will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to see your daily water intake, exercise fluids, electrolytes and schedule.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <CloudSun className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Hydration Schedule</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {results.schedule.map((item) => (
                <article key={item.time} className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-black text-white">{item.time}</h3>
                    <span className="rounded-full bg-[#B30018]/15 px-2.5 py-1 text-xs font-black text-[#F0F8FF]">{item.amount}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.note}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This Water Intake Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This calculator starts with a body-weight hydration baseline, then adds extra fluid for exercise, warm weather and your goal. Longer sessions, hot conditions and performance-focused training increase the chance that electrolytes will be useful alongside water.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="water-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="water-faq" className="mt-2 text-2xl font-black text-white">Hydration Questions</h2>
          <div className="mt-5 space-y-3">
            {FAQS.map((item) => (
              <details key={item.question} className="group rounded-xl border border-zinc-800 bg-black/30 p-4">
                <summary className="cursor-pointer list-none text-sm font-bold text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-lg leading-none text-[#B30018] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
