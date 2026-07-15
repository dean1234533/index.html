// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Beef, Calculator, Egg, Salad, Target, Utensils, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { ACTIVITY_LABELS } from "@/lib/calculator";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("protein-calculator");

const GOALS = {
  fat_loss: "Fat Loss",
  muscle_gain: "Muscle Gain",
  maintenance: "Maintenance",
  body_recomp: "Body Recomposition",
};

const PROTEIN_PER_KG = {
  fat_loss: 2.2,
  muscle_gain: 2,
  maintenance: 1.6,
  body_recomp: 2.2,
};

const ACTIVITY_BONUS = {
  sedentary: 0,
  lightly_active: 0.05,
  moderately_active: 0.1,
  very_active: 0.15,
  extremely_active: 0.2,
};

const PROTEIN_FOODS = [
  "Chicken breast or turkey",
  "Eggs or egg whites",
  "Greek yoghurt or cottage cheese",
  "Tuna, salmon or white fish",
  "Lean beef mince",
  "Tofu, tempeh, lentils or beans",
  "Whey or plant protein shake",
  "Edamame, chickpeas or high-protein wraps",
];

const MEAL_EXAMPLES = [
  "Breakfast: Greek yoghurt, berries, oats and protein powder.",
  "Lunch: Chicken or tofu bowl with rice, salad and olive oil.",
  "Snack: Cottage cheese, fruit, eggs or a protein shake.",
  "Dinner: Lean protein with potatoes, pasta or beans and vegetables.",
];

const FAQS = [
  {
    question: "How much protein do I need per day?",
    answer: "Most active people do well around 1.6 to 2.2 grams per kilogram of body weight, depending on goal and training load.",
  },
  {
    question: "Should protein be higher during fat loss?",
    answer: "Yes. Higher protein can support muscle retention, fullness and recovery while calories are lower.",
  },
  {
    question: "How many meals should I split protein across?",
    answer: "Three to five protein servings per day works well for most people and is easier to stick to than one large serving.",
  },
  {
    question: "Can I hit my protein target without meat?",
    answer: "Yes. Tofu, tempeh, lentils, beans, Greek yoghurt, eggs and plant protein powders can all help.",
  },
  {
    question: "Is more protein always better?",
    answer: "Not always. Once your target is covered, focus on calories, training quality, sleep and consistency.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Protein Calculator",
      url: "https://dbworkouts.co.uk/tools/protein-calculator",
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
  goal: "",
  activity_level: "",
};

function calculateProtein(form) {
  const weight = Number(form.weight_kg);
  const base = PROTEIN_PER_KG[form.goal] || 1.6;
  const multiplier = base + (ACTIVITY_BONUS[form.activity_level] || 0);
  const target = Math.round(weight * multiplier);
  const meals = target <= 130 ? 3 : target <= 185 ? 4 : 5;
  const perMeal = Math.round(target / meals);

  return {
    target,
    meals,
    perMeal,
    gramsPerKg: multiplier.toFixed(1),
    lowerRange: Math.round(weight * Math.max(multiplier - 0.2, 1.4)),
    upperRange: Math.round(weight * (multiplier + 0.2)),
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

export default function ProteinCalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "Protein Calculator | DB's Workouts",
    description: "Calculate your daily protein target, protein per meal, meal structure and high protein food ideas with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/protein-calculator",
    schema: pageSchema,
  });

  const weightError = useMemo(() => {
    if (!form.weight_kg) return "";
    return form.weight_kg < 35 || form.weight_kg > 250 ? "Enter 35 to 250 kg." : "";
  }, [form.weight_kg]);

  const isValid = Number(form.weight_kg) >= 35 &&
    Number(form.weight_kg) <= 250 &&
    form.goal &&
    form.activity_level;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateProtein(form));
    track('tool_calculation', { tool_name: 'protein_calculator' });
  };

  const resultCards = results ? [
    { label: "Daily Protein Target", value: `${results.target}g`, helper: `${results.gramsPerKg}g per kg`, icon: Beef, progress: 100, tone: "red" },
    { label: "Meals Required", value: `${results.meals}`, helper: "Protein servings per day", icon: Utensils, progress: results.meals * 18, tone: "amber" },
    { label: "Protein Per Meal", value: `${results.perMeal}g`, helper: "Average serving", icon: Egg, progress: 76, tone: "blue" },
    { label: "Target Range", value: `${results.lowerRange}-${results.upperRange}g`, helper: "Flexible daily range", icon: Target, progress: 82, tone: "slate" },
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
            Free protein target calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Protein Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Calculate your daily protein target, meal split and simple high-protein food ideas based on your goal and activity level.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Protein Target</h2>
              <p className="mt-1 text-sm text-zinc-500">Enter your weight, goal and weekly activity level.</p>
            </div>

            <div className="space-y-5">
              <Field label="Weight (kg)" error={weightError || (submitted && !form.weight_kg ? "Weight is required." : "")}>
                <NumberInput aria-label="Weight (kg)" min="35" max="250" value={form.weight_kg} onChange={(event) => updateForm("weight_kg", event.target.value)} />
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

              <Field label="Activity Level" error={submitted && !form.activity_level ? "Choose an activity level." : ""}>
                <div className="space-y-2">
                  {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.activity_level === key} onClick={() => updateForm("activity_level", key)} className="w-full">
                      <span className="block text-left">{label}</span>
                    </ChoiceButton>
                  ))}
                </div>
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate Protein <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your target and meal structure will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to see your daily protein target, meals required and protein per meal.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Beef className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
                <h2 className="text-xl font-black text-white">High Protein Foods</h2>
              </div>
              <ul className="grid gap-2 text-sm leading-6 text-zinc-400">
                {PROTEIN_FOODS.map((food) => (
                  <li key={food}>• {food}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Salad className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
                <h2 className="text-xl font-black text-white">Meal Examples</h2>
              </div>
              <ul className="grid gap-2 text-sm leading-6 text-zinc-400">
                {MEAL_EXAMPLES.map((meal) => (
                  <li key={meal}>• {meal}</li>
                ))}
              </ul>
            </article>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This Protein Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This calculator estimates protein from your body weight, goal and activity level. Fat loss and body recomposition use higher targets to support muscle retention, muscle gain uses a strong recovery target, and maintenance uses a practical baseline for general training.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="protein-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="protein-faq" className="mt-2 text-2xl font-black text-white">Protein Questions</h2>
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
