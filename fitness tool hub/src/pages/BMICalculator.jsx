// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, HeartPulse, Ruler, Scale, ShieldCheck, Target, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("bmi-calculator");

const FAQS = [
  {
    question: "What is BMI?",
    answer: "BMI is body mass index, a simple ratio of weight to height used as a general health screening tool.",
  },
  {
    question: "Is BMI accurate for everyone?",
    answer: "No. BMI does not directly measure body fat and can be less useful for very muscular people, athletes or some older adults.",
  },
  {
    question: "What is a healthy BMI range?",
    answer: "For most adults, a BMI between 18.5 and 24.9 is usually considered the healthy range.",
  },
  {
    question: "What does ideal weight range mean?",
    answer: "It is the body-weight range that would place your BMI between 18.5 and 24.9 for your height.",
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
      name: "BMI Calculator",
      url: "https://dbworkouts.co.uk/tools/bmi-calculator",
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
  height_cm: "",
  weight_kg: "",
};

function getCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getAdvice(category) {
  const advice = {
    Underweight: "Focus on consistent meals, strength training and gradual weight gain if appropriate.",
    Healthy: "Maintain consistent training, balanced nutrition and regular activity.",
    Overweight: "A small calorie deficit, higher daily steps and strength training can support fat loss.",
    Obese: "Consider professional support and start with sustainable activity and nutrition habits.",
  };

  return advice[category];
}

function calculateBmi(form) {
  const heightM = Number(form.height_cm) / 100;
  const weight = Number(form.weight_kg);
  const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
  const category = getCategory(bmi);
  const minHealthy = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthy = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    healthyRange: "18.5-24.9",
    idealWeightRange: `${minHealthy}-${maxHealthy}kg`,
    healthAdvice: getAdvice(category),
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

export default function BMICalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "BMI Calculator | DB's Workouts",
    description: "Calculate your BMI, category, healthy BMI range, ideal weight range and health advice with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/bmi-calculator",
    schema: pageSchema,
  });

  const errors = useMemo(() => ({
    height_cm: form.height_cm && (form.height_cm < 120 || form.height_cm > 230) ? "Enter 120 to 230 cm." : "",
    weight_kg: form.weight_kg && (form.weight_kg < 35 || form.weight_kg > 250) ? "Enter 35 to 250 kg." : "",
  }), [form]);

  const isValid = Number(form.height_cm) >= 120 &&
    Number(form.height_cm) <= 230 &&
    Number(form.weight_kg) >= 35 &&
    Number(form.weight_kg) <= 250;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateBmi(form));
    track('tool_calculation', { tool_name: 'bmi_calculator' });
  };

  const resultCards = results ? [
    { label: "BMI", value: `${results.bmi}`, helper: "Body mass index", icon: Scale, progress: Math.min(results.bmi * 3, 100), tone: "red" },
    { label: "Category", value: results.category, helper: "BMI classification", icon: ShieldCheck, progress: 70, tone: "slate" },
    { label: "Healthy Range", value: results.healthyRange, helper: "Adult BMI range", icon: HeartPulse, progress: 82, tone: "blue" },
    { label: "Ideal Weight Range", value: results.idealWeightRange, helper: "For your height", icon: Target, progress: 88, tone: "amber" },
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
            Free BMI calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            BMI Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Calculate your BMI, healthy range, ideal weight range, category and simple health advice.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Details</h2>
              <p className="mt-1 text-sm text-zinc-500">Enter your height and weight to calculate BMI.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Height (cm)" error={errors.height_cm || (submitted && !form.height_cm ? "Height is required." : "")}>
                <NumberInput aria-label="Height" min="120" max="230" value={form.height_cm} onChange={(event) => updateForm("height_cm", event.target.value)} />
              </Field>
              <Field label="Weight (kg)" error={errors.weight_kg || (submitted && !form.weight_kg ? "Weight is required." : "")}>
                <NumberInput aria-label="Weight" min="35" max="250" value={form.weight_kg} onChange={(event) => updateForm("weight_kg", event.target.value)} />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate BMI <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your BMI results will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to see BMI, category and ideal weight range.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Ruler className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Health Advice</h2>
            </div>
            <p className="text-sm leading-7 text-zinc-400">{results.healthAdvice}</p>
            <p className="mt-3 text-xs leading-6 text-zinc-500">BMI is a screening tool and does not directly measure muscle mass, body composition or individual health.</p>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This BMI Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            BMI is calculated by dividing weight in kilograms by height in metres squared. This tool also shows the adult healthy BMI range and the weight range that would place you inside that range for your height.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="bmi-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="bmi-faq" className="mt-2 text-2xl font-black text-white">BMI Questions</h2>
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
