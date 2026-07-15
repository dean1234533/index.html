// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Beef, Calculator, Flame, HeartPulse, Scale, Target, TrendingUp, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { ACTIVITY_LABELS, ACTIVITY_MULTIPLIERS } from "@/lib/calculator";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("tdee-calculator");

const FAQS = [
  {
    question: "What does TDEE mean?",
    answer: "TDEE means total daily energy expenditure. It is an estimate of how many calories you burn per day.",
  },
  {
    question: "Is TDEE the same as maintenance calories?",
    answer: "Yes. Your TDEE is your estimated maintenance calorie target before adding a deficit or surplus.",
  },
  {
    question: "How should I use my fat loss calories?",
    answer: "Use them as a starting target for two to four weeks, then adjust based on weight, energy and training performance.",
  },
  {
    question: "How is protein calculated?",
    answer: "This tool uses a practical 1.8 grams per kilogram of body weight for most active people.",
  },
  {
    question: "How accurate is this calculator?",
    answer: "It gives a useful estimate. Real-world tracking is still the best way to fine tune your target.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "TDEE Calculator",
      url: "https://dbworkouts.co.uk/tools/tdee-calculator",
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
  age: "",
  sex: "",
  height_cm: "",
  weight_kg: "",
  activity_level: "",
};

function calculateTdee(form) {
  const age = Number(form.age);
  const height = Number(form.height_cm);
  const weight = Number(form.weight_kg);
  const bmr = form.sex === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[form.activity_level]);

  return {
    bmr: Math.round(bmr),
    tdee,
    fatLoss: Math.round(tdee * 0.8),
    maintenance: tdee,
    muscleGain: Math.round(tdee * 1.1),
    protein: Math.round(weight * 1.8),
  };
}

function Field({ label, error, children }) {
  return (
    <div className="block">
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

export default function TDEECalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "TDEE Calculator | DB's Workouts",
    description: "Calculate your BMR, TDEE, fat loss calories, maintenance calories, muscle gain calories and protein target with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/tdee-calculator",
    schema: pageSchema,
  });

  const errors = useMemo(() => ({
    age: form.age && (form.age < 16 || form.age > 90) ? "Enter 16 to 90." : "",
    height_cm: form.height_cm && (form.height_cm < 120 || form.height_cm > 230) ? "Enter 120 to 230 cm." : "",
    weight_kg: form.weight_kg && (form.weight_kg < 35 || form.weight_kg > 250) ? "Enter 35 to 250 kg." : "",
  }), [form]);

  const isValid = Number(form.age) >= 16 &&
    Number(form.age) <= 90 &&
    form.sex &&
    Number(form.height_cm) >= 120 &&
    Number(form.height_cm) <= 230 &&
    Number(form.weight_kg) >= 35 &&
    Number(form.weight_kg) <= 250 &&
    form.activity_level;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateTdee(form));
    track('tool_calculation', { tool_name: 'tdee_calculator' });
  };

  const resultCards = results ? [
    { label: "BMR", value: `${results.bmr}`, helper: "Calories at rest", icon: HeartPulse, progress: 58, tone: "slate" },
    { label: "TDEE", value: `${results.tdee}`, helper: "Estimated daily burn", icon: Flame, progress: 100, tone: "red" },
    { label: "Fat Loss Calories", value: `${results.fatLoss}`, helper: "Approx. 20% deficit", icon: Scale, progress: 80, tone: "amber" },
    { label: "Maintenance Calories", value: `${results.maintenance}`, helper: "Hold current weight", icon: Target, progress: 100, tone: "red" },
    { label: "Muscle Gain Calories", value: `${results.muscleGain}`, helper: "Approx. 10% surplus", icon: TrendingUp, progress: 92, tone: "blue" },
    { label: "Recommended Protein", value: `${results.protein}g`, helper: "Daily target", icon: Beef, progress: 72, tone: "slate" },
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
            Free calorie target calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            TDEE Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Estimate your daily calorie burn, maintenance target, fat loss calories, muscle gain calories and protein in under a minute.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Details</h2>
              <p className="mt-1 text-sm text-zinc-500">Enter your stats and choose the activity level that best matches your week.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Age" error={errors.age || (submitted && !form.age ? "Age is required." : "")}>
                <NumberInput aria-label="Age" min="16" max="90" value={form.age} onChange={(event) => updateForm("age", event.target.value)} />
              </Field>
              <Field label="Sex" error={submitted && !form.sex ? "Choose sex." : ""}>
                <div className="grid grid-cols-2 gap-2">
                  {["male", "female"].map((sex) => (
                    <ChoiceButton key={sex} selected={form.sex === sex} onClick={() => updateForm("sex", sex)}>
                      {sex[0].toUpperCase() + sex.slice(1)}
                    </ChoiceButton>
                  ))}
                </div>
              </Field>
              <Field label="Height (cm)" error={errors.height_cm || (submitted && !form.height_cm ? "Height is required." : "")}>
                <NumberInput aria-label="Height (cm)" min="120" max="230" value={form.height_cm} onChange={(event) => updateForm("height_cm", event.target.value)} />
              </Field>
              <Field label="Weight (kg)" error={errors.weight_kg || (submitted && !form.weight_kg ? "Weight is required." : "")}>
                <NumberInput aria-label="Weight (kg)" min="35" max="250" value={form.weight_kg} onChange={(event) => updateForm("weight_kg", event.target.value)} />
              </Field>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-sm font-semibold text-zinc-300">Activity Level</p>
              {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                <ChoiceButton key={key} selected={form.activity_level === key} onClick={() => updateForm("activity_level", key)} className="w-full">
                  <span className="block text-left">{label}</span>
                </ChoiceButton>
              ))}
              {submitted && !form.activity_level && <p className="text-xs font-medium text-[#D0182E]">Choose an activity level.</p>}
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate TDEE <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your calorie and protein targets will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to see your BMR, TDEE, calorie targets and protein recommendation.
              </div>
            )}
          </section>
        </section>

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This TDEE Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This calculator estimates your basal metabolic rate using the Mifflin-St Jeor equation, then multiplies it by your selected activity level. The result is your estimated TDEE, which is also your maintenance calories. Fat loss calories use a moderate deficit, muscle gain calories use a controlled surplus, and protein is set high enough to support training and recovery.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="tdee-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="tdee-faq" className="mt-2 text-2xl font-black text-white">TDEE Questions</h2>
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
