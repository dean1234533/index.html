// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Gauge, Ruler, Scale, ShieldCheck, Target, User, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("body-fat-calculator");

const FAQS = [
  {
    question: "What is the US Navy body fat method?",
    answer: "It estimates body fat percentage from circumference measurements such as waist, neck, height and hip for women.",
  },
  {
    question: "How accurate is this body fat calculator?",
    answer: "It is an estimate. For best results, measure consistently and use trends rather than one single reading.",
  },
  {
    question: "Why do women need a hip measurement?",
    answer: "The US Navy formula for women uses waist, hip, neck and height to estimate body fat percentage.",
  },
  {
    question: "Why does the calculator ask for weight?",
    answer: "Weight is needed to estimate fat mass and lean body mass from your body fat percentage.",
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
      name: "Body Fat Calculator",
      url: "https://dbworkouts.co.uk/tools/body-fat-calculator",
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
  sex: "",
  height_cm: "",
  weight_kg: "",
  neck_cm: "",
  waist_cm: "",
  hip_cm: "",
};

function cmToInches(value) {
  return Number(value) / 2.54;
}

function getCategory(sex, percentage) {
  if (sex === "male") {
    if (percentage < 6) return "Essential";
    if (percentage < 14) return "Athletic";
    if (percentage < 18) return "Fitness";
    if (percentage < 25) return "Average";
    return "High";
  }

  if (percentage < 14) return "Essential";
  if (percentage < 21) return "Athletic";
  if (percentage < 25) return "Fitness";
  if (percentage < 32) return "Average";
  return "High";
}

function getIdealRange(sex) {
  return sex === "male" ? "10-20%" : "18-28%";
}

function calculateBodyFat(form) {
  const height = cmToInches(form.height_cm);
  const neck = cmToInches(form.neck_cm);
  const waist = cmToInches(form.waist_cm);
  const hip = cmToInches(form.hip_cm);
  const weight = Number(form.weight_kg);
  const bodyFat = form.sex === "male"
    ? 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
    : 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
  const bodyFatPercentage = Math.max(2, Math.min(60, Math.round(bodyFat * 10) / 10));
  const fatMass = Math.round(weight * (bodyFatPercentage / 100) * 10) / 10;
  const leanMass = Math.round((weight - fatMass) * 10) / 10;

  return {
    bodyFatPercentage,
    fatMass,
    leanMass,
    category: getCategory(form.sex, bodyFatPercentage),
    idealRange: getIdealRange(form.sex),
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

export default function BodyFatCalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "Body Fat Calculator | DB's Workouts",
    description: "Estimate body fat percentage, lean body mass, fat mass and category using the US Navy method with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/body-fat-calculator",
    schema: pageSchema,
  });

  const errors = useMemo(() => ({
    height_cm: form.height_cm && (form.height_cm < 120 || form.height_cm > 230) ? "Enter 120 to 230 cm." : "",
    weight_kg: form.weight_kg && (form.weight_kg < 35 || form.weight_kg > 250) ? "Enter 35 to 250 kg." : "",
    neck_cm: form.neck_cm && (form.neck_cm < 20 || form.neck_cm > 70) ? "Enter 20 to 70 cm." : "",
    waist_cm: form.waist_cm && (form.waist_cm < 45 || form.waist_cm > 180) ? "Enter 45 to 180 cm." : "",
    hip_cm: form.hip_cm && (form.hip_cm < 55 || form.hip_cm > 190) ? "Enter 55 to 190 cm." : "",
  }), [form]);

  const measurementsValid = Number(form.height_cm) >= 120 &&
    Number(form.height_cm) <= 230 &&
    Number(form.weight_kg) >= 35 &&
    Number(form.weight_kg) <= 250 &&
    Number(form.neck_cm) >= 20 &&
    Number(form.neck_cm) <= 70 &&
    Number(form.waist_cm) >= 45 &&
    Number(form.waist_cm) <= 180 &&
    (form.sex === "male" || (Number(form.hip_cm) >= 55 && Number(form.hip_cm) <= 190));
  const formulaValid = form.sex === "male"
    ? Number(form.waist_cm) > Number(form.neck_cm)
    : Number(form.waist_cm) + Number(form.hip_cm) > Number(form.neck_cm);
  const isValid = form.sex && measurementsValid && formulaValid;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateBodyFat(form));
    track('tool_calculation', { tool_name: 'body_fat_calculator' });
  };

  const resultCards = results ? [
    { label: "Estimated Body Fat", value: `${results.bodyFatPercentage}%`, helper: "US Navy estimate", icon: Gauge, progress: Math.min(results.bodyFatPercentage * 2, 100), tone: "red" },
    { label: "Lean Body Mass", value: `${results.leanMass}kg`, helper: "Estimated non-fat mass", icon: User, progress: 82, tone: "blue" },
    { label: "Fat Mass", value: `${results.fatMass}kg`, helper: "Estimated fat tissue", icon: Scale, progress: Math.min(results.bodyFatPercentage * 2, 100), tone: "amber" },
    { label: "Category", value: results.category, helper: "Body fat classification", icon: ShieldCheck, progress: 70, tone: "slate" },
    { label: "Ideal Range", value: results.idealRange, helper: "General fitness range", icon: Target, progress: 80, tone: "red" },
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
            US Navy method
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Body Fat Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Estimate body fat percentage, lean body mass, fat mass and category using simple tape measurements.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Measurements</h2>
              <p className="mt-1 text-sm text-zinc-500">Measure in centimetres using a flexible tape.</p>
            </div>

            <div className="space-y-5">
              <Field label="Sex" error={submitted && !form.sex ? "Choose sex." : ""}>
                <div className="grid grid-cols-2 gap-2">
                  {["male", "female"].map((sex) => (
                    <ChoiceButton key={sex} selected={form.sex === sex} onClick={() => updateForm("sex", sex)}>
                      {sex[0].toUpperCase() + sex.slice(1)}
                    </ChoiceButton>
                  ))}
                </div>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Height (cm)" error={errors.height_cm || (submitted && !form.height_cm ? "Height is required." : "")}>
                  <NumberInput aria-label="Height" min="120" max="230" value={form.height_cm} onChange={(event) => updateForm("height_cm", event.target.value)} />
                </Field>
                <Field label="Weight (kg)" error={errors.weight_kg || (submitted && !form.weight_kg ? "Weight is required." : "")}>
                  <NumberInput aria-label="Weight" min="35" max="250" value={form.weight_kg} onChange={(event) => updateForm("weight_kg", event.target.value)} />
                </Field>
                <Field label="Neck (cm)" error={errors.neck_cm || (submitted && !form.neck_cm ? "Neck is required." : "")}>
                  <NumberInput aria-label="Neck" min="20" max="70" value={form.neck_cm} onChange={(event) => updateForm("neck_cm", event.target.value)} />
                </Field>
                <Field label="Waist (cm)" error={errors.waist_cm || (submitted && !form.waist_cm ? "Waist is required." : "")}>
                  <NumberInput aria-label="Waist" min="45" max="180" value={form.waist_cm} onChange={(event) => updateForm("waist_cm", event.target.value)} />
                </Field>
                {form.sex === "female" && (
                  <Field label="Hip (cm)" error={errors.hip_cm || (submitted && !form.hip_cm ? "Hip is required." : "")}>
                    <NumberInput aria-label="Hip" min="55" max="190" value={form.hip_cm} onChange={(event) => updateForm("hip_cm", event.target.value)} />
                  </Field>
                )}
              </div>
              {submitted && !formulaValid && <p className="text-xs font-medium text-[#D0182E]">Check your measurements. Waist must be greater than neck for the formula.</p>}
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate Body Fat <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results Dashboard</h2>
            <p className="mt-1 text-sm text-zinc-500">Your body composition estimate will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to estimate body fat percentage, lean body mass, fat mass and category.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Ruler className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Body Composition Split</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-bold text-zinc-300">Fat Mass</span>
                  <span className="font-black text-white">{results.bodyFatPercentage}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#B30018] to-[#D0182E]" style={{ width: `${Math.min(results.bodyFatPercentage, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-bold text-zinc-300">Lean Mass</span>
                  <span className="font-black text-white">{Math.round((100 - results.bodyFatPercentage) * 10) / 10}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500" style={{ width: `${Math.max(100 - results.bodyFatPercentage, 0)}%` }} />
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This Body Fat Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This calculator uses the US Navy circumference method. Men use height, neck and waist measurements. Women use height, neck, waist and hip measurements. Weight is then used to estimate lean body mass and fat mass.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="body-fat-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="body-fat-faq" className="mt-2 text-2xl font-black text-white">Body Fat Questions</h2>
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
