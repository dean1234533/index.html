// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Calculator, Flame, Gauge, Target, Timer, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("calorie-burn-calculator");

const ACTIVITIES = {
  walking: { label: "Walking", met: 3.5 },
  running: { label: "Running", met: 9.8 },
  cycling: { label: "Cycling", met: 7.5 },
  swimming: { label: "Swimming", met: 8.3 },
  football: { label: "Football", met: 7 },
  hiit: { label: "HIIT", met: 8 },
  weights: { label: "Weights", met: 5 },
  skipping: { label: "Skipping", met: 11 },
  yoga: { label: "Yoga", met: 2.8 },
  boxing: { label: "Boxing", met: 9 },
};

const FAQS = [
  {
    question: "How are calories burned calculated?",
    answer: "This calculator uses MET values, body weight and duration to estimate energy burned during activity.",
  },
  {
    question: "What is a MET value?",
    answer: "MET stands for metabolic equivalent. Higher MET activities generally burn more calories per minute.",
  },
  {
    question: "Are calorie burn estimates exact?",
    answer: "No. Fitness level, intensity, terrain, technique and rest periods can all change real calorie burn.",
  },
  {
    question: "Should I eat back exercise calories?",
    answer: "It depends on your goal. For fat loss, many people avoid eating all exercise calories back.",
  },
  {
    question: "Which activity burns the most calories?",
    answer: "In this tool, skipping, running and boxing tend to estimate higher calorie burn because their MET values are high.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calorie Burn Calculator",
      url: "https://dbworkouts.co.uk/tools/calorie-burn-calculator",
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
  activity: "",
  duration_minutes: "",
};

function calculateCaloriesBurned(form) {
  const weight = Number(form.weight_kg);
  const duration = Number(form.duration_minutes);
  const activity = ACTIVITIES[form.activity];
  const calories = Math.round((activity.met * 3.5 * weight / 200) * duration);
  const caloriesPerMinute = Math.round(calories / duration);
  const caloriesPerHour = Math.round(caloriesPerMinute * 60);

  return {
    activity,
    calories,
    caloriesPerMinute,
    caloriesPerHour,
    duration,
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

function ChoiceButton({ selected, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`rounded-lg border px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] ${
        selected ? "border-[#B30018] bg-[#B30018] text-white" : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600"
      }`}
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

export default function CalorieBurnCalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "Calorie Burn Calculator | DB's Workouts",
    description: "Estimate calories burned from walking, running, cycling, swimming, football, HIIT, weights, skipping, yoga and boxing.",
    canonical: "https://dbworkouts.co.uk/tools/calorie-burn-calculator",
    schema: pageSchema,
  });

  const errors = useMemo(() => ({
    weight_kg: form.weight_kg && (form.weight_kg < 35 || form.weight_kg > 250) ? "Enter 35 to 250 kg." : "",
    duration_minutes: form.duration_minutes && (form.duration_minutes < 1 || form.duration_minutes > 300) ? "Enter 1 to 300 minutes." : "",
  }), [form.duration_minutes, form.weight_kg]);

  const isValid = Number(form.weight_kg) >= 35 &&
    Number(form.weight_kg) <= 250 &&
    form.activity &&
    Number(form.duration_minutes) >= 1 &&
    Number(form.duration_minutes) <= 300;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateCaloriesBurned(form));
    track('tool_calculation', { tool_name: 'calorie_burn_calculator' });
  };

  const resultCards = results ? [
    { label: "Calories Burned", value: `${results.calories}`, helper: `${results.activity.label} estimate`, icon: Flame, progress: 100, tone: "red" },
    { label: "Calories / Minute", value: `${results.caloriesPerMinute}`, helper: "Estimated burn rate", icon: Timer, progress: Math.min(results.caloriesPerMinute * 7, 100), tone: "amber" },
    { label: "Calories / Hour", value: `${results.caloriesPerHour}`, helper: "Projected hourly burn", icon: Gauge, progress: 82, tone: "blue" },
    { label: "Activity MET", value: `${results.activity.met}`, helper: "Intensity estimate", icon: Activity, progress: Math.min(results.activity.met * 9, 100), tone: "slate" },
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
            Free activity calorie calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Calorie Burn Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Estimate calories burned from common workouts using your weight, activity and session duration.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Activity</h2>
              <p className="mt-1 text-sm text-zinc-500">Choose an activity and enter how long you trained.</p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Weight (kg)" error={errors.weight_kg || (submitted && !form.weight_kg ? "Weight is required." : "")}>
                  <NumberInput aria-label="Weight" min="35" max="250" value={form.weight_kg} onChange={(event) => updateForm("weight_kg", event.target.value)} />
                </Field>
                <Field label="Duration (minutes)" error={errors.duration_minutes || (submitted && !form.duration_minutes ? "Duration is required." : "")}>
                  <NumberInput aria-label="Duration" min="1" max="300" value={form.duration_minutes} onChange={(event) => updateForm("duration_minutes", event.target.value)} />
                </Field>
              </div>

              <Field label="Activity" error={submitted && !form.activity ? "Choose an activity." : ""}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(ACTIVITIES).map(([key, activity]) => (
                    <ChoiceButton key={key} selected={form.activity === key} onClick={() => updateForm("activity", key)}>
                      {activity.label}
                    </ChoiceButton>
                  ))}
                </div>
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate Calories <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your estimated calorie burn will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to estimate calories burned for your activity.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Session Summary</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Activity</p>
                <p className="mt-1 text-lg font-black text-white">{results.activity.label}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Duration</p>
                <p className="mt-1 text-lg font-black text-white">{results.duration} min</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Method</p>
                <p className="mt-1 text-lg font-black text-white">MET estimate</p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This Calorie Burn Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This calculator uses MET values to estimate calories burned from body weight and activity duration. It gives a useful training estimate, but real calorie burn changes with intensity, fitness level, terrain, rest periods and technique.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="calorie-burn-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="calorie-burn-faq" className="mt-2 text-2xl font-black text-white">Calorie Burn Questions</h2>
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
