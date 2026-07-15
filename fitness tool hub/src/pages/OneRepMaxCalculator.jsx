// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Dumbbell, Gauge, Target, TrendingUp, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("one-rep-max-calculator");

const FAQS = [
  {
    question: "What is a one rep max?",
    answer: "A one rep max is the heaviest weight you could lift for one good repetition with safe technique.",
  },
  {
    question: "How accurate is this calculator?",
    answer: "It is an estimate based on reps and load. It is most useful when your set is between 2 and 10 reps.",
  },
  {
    question: "Should beginners test a true 1RM?",
    answer: "Usually no. Beginners are better using estimated numbers from controlled rep sets.",
  },
  {
    question: "How should I use training percentages?",
    answer: "Use lighter percentages for volume and technique, and heavier percentages for lower-rep strength work.",
  },
  {
    question: "When should I recalculate my 1RM?",
    answer: "Recalculate after a clear strength increase, a new rep PR, or every four to eight weeks.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "One Rep Max Calculator",
      url: "https://dbworkouts.co.uk/tools/one-rep-max-calculator",
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
  weight_lifted: "",
  reps: "",
};

const TABLE_PERCENTAGES = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

function estimateOneRepMax(form) {
  const weight = Number(form.weight_lifted);
  const reps = Number(form.reps);
  const estimated = reps === 1 ? weight : weight * (1 + reps / 30);
  const oneRepMax = Math.round(estimated);

  return {
    oneRepMax,
    ninety: Math.round(oneRepMax * 0.9),
    eightyFive: Math.round(oneRepMax * 0.85),
    eighty: Math.round(oneRepMax * 0.8),
    seventyFive: Math.round(oneRepMax * 0.75),
    table: TABLE_PERCENTAGES.map((percentage) => ({
      percentage,
      load: Math.round(oneRepMax * (percentage / 100)),
      focus: percentage >= 90
        ? "Heavy strength"
        : percentage >= 80
          ? "Strength volume"
          : percentage >= 70
            ? "Hypertrophy"
            : "Technique / speed",
    })),
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

function NumberInput(props) {
  return (
    <input
      type="number"
      className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none transition-colors focus:border-[#B30018] focus:ring-2 focus:ring-[#B30018]/30"
      {...props}
    />
  );
}

export default function OneRepMaxCalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "One Rep Max Calculator | DB's Workouts",
    description: "Estimate your one rep max and training percentages for strength work with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/one-rep-max-calculator",
    schema: pageSchema,
  });

  const errors = useMemo(() => ({
    weight_lifted: form.weight_lifted && (form.weight_lifted < 1 || form.weight_lifted > 500) ? "Enter 1 to 500 kg." : "",
    reps: form.reps && (form.reps < 1 || form.reps > 15) ? "Enter 1 to 15 reps." : "",
  }), [form.reps, form.weight_lifted]);

  const isValid = Number(form.weight_lifted) >= 1 &&
    Number(form.weight_lifted) <= 500 &&
    Number(form.reps) >= 1 &&
    Number(form.reps) <= 15;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(estimateOneRepMax(form));
    track('tool_calculation', { tool_name: 'one_rep_max_calculator' });
  };

  const resultCards = results ? [
    { label: "Estimated 1RM", value: `${results.oneRepMax}kg`, helper: "Estimated max single", icon: Dumbbell, progress: 100, tone: "red" },
    { label: "90%", value: `${results.ninety}kg`, helper: "Heavy strength work", icon: Gauge, progress: 90, tone: "amber" },
    { label: "85%", value: `${results.eightyFive}kg`, helper: "Strength volume", icon: TrendingUp, progress: 85, tone: "blue" },
    { label: "80%", value: `${results.eighty}kg`, helper: "Quality working sets", icon: Target, progress: 80, tone: "slate" },
    { label: "75%", value: `${results.seventyFive}kg`, helper: "Volume and technique", icon: Calculator, progress: 75, tone: "red" },
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
            Free strength calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            One Rep Max Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Estimate your one rep max and build practical training percentages from a recent lift.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Lift</h2>
              <p className="mt-1 text-sm text-zinc-500">Use a hard, clean set between 1 and 15 reps.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Weight lifted (kg)" error={errors.weight_lifted || (submitted && !form.weight_lifted ? "Weight is required." : "")}>
                <NumberInput aria-label="Weight lifted" min="1" max="500" value={form.weight_lifted} onChange={(event) => updateForm("weight_lifted", event.target.value)} />
              </Field>
              <Field label="Reps" error={errors.reps || (submitted && !form.reps ? "Reps are required." : "")}>
                <NumberInput aria-label="Reps" min="1" max="15" value={form.reps} onChange={(event) => updateForm("reps", event.target.value)} />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate 1RM <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your estimated max and key percentages will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to see your estimated 1RM and training percentages.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Strength Table</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Percent</th>
                    <th className="px-4 py-3">Load</th>
                    <th className="px-4 py-3">Training Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {results.table.map((row) => (
                    <tr key={row.percentage} className="bg-zinc-950/40">
                      <td className="px-4 py-3 font-black text-white">{row.percentage}%</td>
                      <td className="px-4 py-3 font-bold text-[#F0F8FF]">{row.load}kg</td>
                      <td className="px-4 py-3 text-zinc-400">{row.focus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This 1RM Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This calculator uses the Epley formula to estimate your one rep max from a recent set. It is best used with controlled reps and solid technique, then applied to training percentages for strength, volume and technique work.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="one-rep-max-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="one-rep-max-faq" className="mt-2 text-2xl font-black text-white">1RM Questions</h2>
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
