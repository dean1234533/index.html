// @ts-nocheck
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Clock, Flag, Gauge, Map, Route, Timer, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("running-pace-calculator");

const RACES = [
  { label: "5K", distance: 5 },
  { label: "10K", distance: 10 },
  { label: "Half Marathon", distance: 21.0975 },
  { label: "Marathon", distance: 42.195 },
];

const FAQS = [
  {
    question: "How is running pace calculated?",
    answer: "Pace is total time divided by distance. This tool shows both minutes per kilometre and minutes per mile.",
  },
  {
    question: "How are race predictions calculated?",
    answer: "Predictions use the Riegel formula, which estimates how pace changes across different race distances.",
  },
  {
    question: "Are the race predictions guaranteed?",
    answer: "No. They are useful estimates, but terrain, weather, training, pacing and race experience all matter.",
  },
  {
    question: "Should I use a recent run?",
    answer: "Yes. A recent hard effort or race gives more useful predictions than an easy training run.",
  },
  {
    question: "Can beginners use this calculator?",
    answer: "Yes. It is helpful for setting realistic training paces and understanding race targets.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Running Pace Calculator",
      url: "https://dbworkouts.co.uk/tools/running-pace-calculator",
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
  distance_km: "",
  hours: "0",
  minutes: "",
  seconds: "0",
};

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatPace(secondsPerUnit) {
  return `${formatDuration(secondsPerUnit)}`;
}

function calculateRunningPace(form) {
  const distance = Number(form.distance_km);
  const totalSeconds = Number(form.hours || 0) * 3600 + Number(form.minutes || 0) * 60 + Number(form.seconds || 0);
  const pacePerKm = totalSeconds / distance;
  const pacePerMile = pacePerKm * 1.60934;
  const predictions = RACES.map((race) => ({
    ...race,
    seconds: totalSeconds * (race.distance / distance) ** 1.06,
  }));

  return {
    totalSeconds,
    pacePerKm,
    pacePerMile,
    predictions,
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

export default function RunningPaceCalculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  usePageSeo({
    title: "Running Pace Calculator | DB's Workouts",
    description: "Calculate pace per kilometre, pace per mile and predicted 5K, 10K, half marathon and marathon times with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/running-pace-calculator",
    schema: pageSchema,
  });

  const totalSeconds = Number(form.hours || 0) * 3600 + Number(form.minutes || 0) * 60 + Number(form.seconds || 0);
  const errors = useMemo(() => ({
    distance_km: form.distance_km && (form.distance_km < 0.1 || form.distance_km > 300) ? "Enter 0.1 to 300 km." : "",
    time: submitted && totalSeconds <= 0 ? "Enter a time greater than zero." : "",
  }), [form.distance_km, submitted, totalSeconds]);

  const isValid = Number(form.distance_km) >= 0.1 &&
    Number(form.distance_km) <= 300 &&
    totalSeconds > 0 &&
    Number(form.hours || 0) >= 0 &&
    Number(form.minutes || 0) >= 0 &&
    Number(form.seconds || 0) >= 0;

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setResults(calculateRunningPace(form));
    track('tool_calculation', { tool_name: 'running_pace_calculator' });
  };

  const predictions = results?.predictions || [];
  const longestPrediction = Math.max(...predictions.map((race) => race.seconds), 1);
  const predictionMap = Object.fromEntries(predictions.map((race) => [race.label, race]));
  const resultCards = results ? [
    { label: "Pace / km", value: formatPace(results.pacePerKm), helper: "Minutes per kilometre", icon: Gauge, progress: 85, tone: "red" },
    { label: "Pace / mile", value: formatPace(results.pacePerMile), helper: "Minutes per mile", icon: Route, progress: 76, tone: "blue" },
    { label: "Predicted 5K", value: formatDuration(predictionMap["5K"].seconds), helper: "Race estimate", icon: Flag, progress: 55, tone: "amber" },
    { label: "Predicted 10K", value: formatDuration(predictionMap["10K"].seconds), helper: "Race estimate", icon: Timer, progress: 70, tone: "slate" },
    { label: "Half Marathon", value: formatDuration(predictionMap["Half Marathon"].seconds), helper: "Predicted finish", icon: Map, progress: 82, tone: "red" },
    { label: "Marathon", value: formatDuration(predictionMap.Marathon.seconds), helper: "Predicted finish", icon: Clock, progress: 100, tone: "blue" },
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
            Free running pace calculator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Running Pace Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Calculate pace per kilometre, pace per mile and predicted race times from your distance and time.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Your Run</h2>
              <p className="mt-1 text-sm text-zinc-500">Enter distance in kilometres and your finish time.</p>
            </div>

            <div className="space-y-5">
              <Field label="Distance (km)" error={errors.distance_km || (submitted && !form.distance_km ? "Distance is required." : "")}>
                <NumberInput aria-label="Distance" min="0.1" max="300" step="0.01" value={form.distance_km} onChange={(event) => updateForm("distance_km", event.target.value)} />
              </Field>

              <Field label="Time" error={errors.time}>
                <div className="grid grid-cols-3 gap-2">
                  <NumberInput aria-label="Hours" min="0" max="99" value={form.hours} onChange={(event) => updateForm("hours", event.target.value)} />
                  <NumberInput aria-label="Minutes" min="0" max="59" value={form.minutes} onChange={(event) => updateForm("minutes", event.target.value)} />
                  <NumberInput aria-label="Seconds" min="0" max="59" value={form.seconds} onChange={(event) => updateForm("seconds", event.target.value)} />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                  <span>Hours</span>
                  <span>Minutes</span>
                  <span>Seconds</span>
                </div>
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Calculate Pace <Calculator className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your paces and race predictions will appear here.</p>
            {results ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to see your pace per kilometre, pace per mile and predicted race times.
              </div>
            )}
          </section>
        </section>

        {results && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Route className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">Pace Chart</h2>
            </div>
            <div className="space-y-4">
              {predictions.map((race) => (
                <div key={race.label}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-white">{race.label}</span>
                    <span className="font-black text-[#F0F8FF]">{formatDuration(race.seconds)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B30018] to-[#D0182E]"
                      style={{ width: `${Math.max((race.seconds / longestPrediction) * 100, 12)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This Running Pace Calculator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Pace is calculated by dividing your total run time by distance. Race predictions use the Riegel formula, which estimates how performance changes as race distance increases.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="running-pace-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="running-pace-faq" className="mt-2 text-2xl font-black text-white">Running Pace Questions</h2>
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
