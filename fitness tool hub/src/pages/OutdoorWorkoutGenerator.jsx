// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Download, Map, Printer, RefreshCw, Share2, Timer, Zap } from "lucide-react";
import { track } from "@/lib/analytics";

import ResultCard from "@/components/calculator/ResultCard";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("outdoor-workout-generator");

const GOALS = {
  fat_loss: "Fat Loss",
  strength: "Strength",
  muscle: "Muscle Building",
  fitness: "General Fitness",
  conditioning: "Conditioning",
};

const LEVELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const EQUIPMENT = {
  bodyweight: "Bodyweight",
  bands: "Resistance Bands",
  dumbbells: "Dumbbells",
  kettlebell: "Kettlebell",
  mixed: "Mixed Kit",
};

const LOCATIONS = {
  park: "Park",
  garden: "Garden",
  beach: "Beach",
  track: "Track",
  street: "Street / Hills",
};

const LENGTHS = [20, 30, 40, 50, 60];

const WARMUPS = [
  "Brisk walk, arm circles, hip openers, bodyweight squats",
  "Light jog, walking lunges, inchworms, shoulder taps",
  "Marching high knees, glute bridges, lateral lunges, plank walkouts",
  "Easy shuttle jogs, leg swings, squat-to-stand, press-up reaches",
];

const FINISHERS = [
  "6 rounds: 20s sprint, 40s walk",
  "5 minutes: burpees every minute, remaining time fast walk",
  "4 rounds: 30 mountain climbers, 20 jumping lunges, 30s rest",
  "8 minutes: alternating fast step-ups and plank shoulder taps",
];

const COOLDOWNS = [
  "Slow walk, quad stretch, hamstring stretch, chest opener",
  "Easy breathing walk, calf stretch, hip flexor stretch, child's pose",
  "Gentle walk, glute stretch, thoracic rotations, relaxed breathing",
  "Light mobility flow, long exhales, calves, hips and shoulders",
];

const EXERCISES = {
  bodyweight: ["Push-ups", "Squats", "Reverse lunges", "Plank shoulder taps", "Step-ups", "Bear crawls", "Glute bridges", "Mountain climbers"],
  bands: ["Band rows", "Band presses", "Band squats", "Band pull-aparts", "Band good mornings", "Pallof press", "Band curls", "Band triceps extensions"],
  dumbbells: ["Goblet squats", "Dumbbell rows", "Dumbbell presses", "Romanian deadlifts", "Farmer carries", "Reverse lunges", "Thrusters", "Renegade rows"],
  kettlebell: ["Kettlebell swings", "Goblet squats", "Kettlebell rows", "Kettlebell presses", "Suitcase carries", "Clean to press", "Deadlifts", "Reverse lunges"],
  mixed: ["Push-ups", "Goblet squats", "Band rows", "Farmer carries", "Step-ups", "Kettlebell swings", "Dumbbell presses", "Plank drags"],
};

const GOAL_FOCUS = {
  fat_loss: "Metabolic conditioning with short rests and full-body movement",
  strength: "Controlled strength circuits with heavier effort and longer rest",
  muscle: "Higher-volume muscle-building circuits with strict tempo",
  fitness: "Balanced strength, cardio and mobility",
  conditioning: "Intervals, carries and fast-paced bodyweight work",
};

const FAQS = [
  {
    question: "Can I do these workouts with no equipment?",
    answer: "Yes. Choose bodyweight and the generator will build sessions using outdoor-friendly bodyweight exercises.",
  },
  {
    question: "Are the workouts different each time?",
    answer: "Yes. Generate New Workout reshuffles exercises, structure, finisher and cooldown for a fresh plan.",
  },
  {
    question: "How hard should the workout feel?",
    answer: "Aim for controlled hard work while keeping form sharp. Stop if pain, dizziness or unusual discomfort appears.",
  },
  {
    question: "Can beginners use this generator?",
    answer: "Yes. Choose beginner and use the lower end of the rep ranges with extra rest if needed.",
  },
  {
    question: "Is this medical advice?",
    answer: "No. This generator is for educational purposes only and is not medical advice.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Outdoor Workout Generator",
      url: "https://dbworkouts.co.uk/tools/outdoor-workout-generator",
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
  goal: "",
  level: "",
  length: "",
  equipment: "",
  location: "",
};

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function getWorkoutSettings(form) {
  const length = Number(form.length);
  const level = form.level;
  const goal = form.goal;
  const exerciseCount = length <= 20 ? 4 : length <= 40 ? 5 : 6;
  const rounds = level === "advanced" ? 5 : level === "intermediate" ? 4 : 3;
  const reps = goal === "strength"
    ? level === "advanced" ? "6-10" : "8-10"
    : goal === "conditioning"
      ? "30-45 seconds"
      : level === "beginner" ? "8-12" : "10-15";
  const rest = goal === "strength"
    ? "75-90 seconds"
    : goal === "fat_loss" || goal === "conditioning"
      ? "30-45 seconds"
      : "45-60 seconds";

  return { exerciseCount, rounds, reps, rest };
}

function generateWorkout(form) {
  const settings = getWorkoutSettings(form);
  const selectedExercises = shuffle(EXERCISES[form.equipment] || EXERCISES.bodyweight).slice(0, settings.exerciseCount);
  const workout = selectedExercises.map((exercise, index) => ({
    name: exercise,
    sets: settings.rounds,
    reps: index % 2 === 0 && form.goal === "conditioning" ? "40 seconds" : settings.reps,
    rest: settings.rest,
  }));
  const length = Number(form.length);
  const intensity = form.level === "advanced" ? 8.5 : form.level === "intermediate" ? 7 : 5.5;
  const caloriesBurned = Math.round((intensity * 3.5 * 78 / 200) * length);

  return {
    id: String(Date.now()),
    warmUp: pick(WARMUPS),
    workout,
    finisher: pick(FINISHERS),
    cooldown: pick(COOLDOWNS),
    caloriesBurned,
    difficulty: form.level === "advanced" ? "Hard" : form.level === "intermediate" ? "Moderate" : "Manageable",
    focus: GOAL_FOCUS[form.goal],
  };
}

function encodeShare(form, workout) {
  return btoa(JSON.stringify({ form, workout }));
}

function decodeShare(value) {
  try {
    return JSON.parse(atob(value));
  } catch {
    return null;
  }
}

function workoutToText(form, workout) {
  if (!workout) return "";
  return [
    "DB's Workouts Outdoor Workout",
    `Goal: ${GOALS[form.goal]}`,
    `Level: ${LEVELS[form.level]}`,
    `Length: ${form.length} minutes`,
    `Equipment: ${EQUIPMENT[form.equipment]}`,
    `Location: ${LOCATIONS[form.location]}`,
    "",
    `Warm up: ${workout.warmUp}`,
    "",
    "Workout:",
    ...workout.workout.map((item) => `${item.name}: ${item.sets} sets x ${item.reps}, rest ${item.rest}`),
    "",
    `Finisher: ${workout.finisher}`,
    `Cooldown: ${workout.cooldown}`,
    `Calories Burned: ${workout.caloriesBurned}`,
    `Difficulty: ${workout.difficulty}`,
    `Workout Focus: ${workout.focus}`,
  ].join("\n");
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

export default function OutdoorWorkoutGenerator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [status, setStatus] = useState("");

  usePageSeo({
    title: "Outdoor Workout Generator | DB's Workouts",
    description: "Generate personalised outdoor workouts with warm up, sets, reps, rest, finisher, cooldown and calories burned.",
    canonical: "https://dbworkouts.co.uk/tools/outdoor-workout-generator",
    schema: pageSchema,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("w");
    if (!shared) return;
    const decoded = decodeShare(shared);
    if (decoded?.form && decoded?.workout) {
      setForm(decoded.form);
      setWorkout(decoded.workout);
    }
  }, []);

  const isValid = form.goal && form.level && form.length && form.equipment && form.location;
  const workoutText = useMemo(() => workoutToText(form, workout), [form, workout]);
  const resultCards = workout ? [
    { label: "Calories Burned", value: `${workout.caloriesBurned}`, helper: "Session estimate", icon: Zap, progress: 88, tone: "red" },
    { label: "Difficulty", value: workout.difficulty, helper: LEVELS[form.level], icon: Timer, progress: form.level === "advanced" ? 92 : form.level === "intermediate" ? 74 : 56, tone: "amber" },
    { label: "Workout Focus", value: GOALS[form.goal], helper: workout.focus, icon: Map, progress: 82, tone: "blue" },
  ] : [];

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleGenerate = (event) => {
    event?.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    setWorkout(generateWorkout(form));
    setStatus("Workout generated.");
    track('tool_calculation', { tool_name: 'outdoor_workout_generator' });
  };

  const handleShare = async () => {
    if (!workout) return;
    const url = `${window.location.origin}${window.location.pathname}?w=${encodeShare(form, workout)}`;
    window.history.replaceState({}, "", url);
    await navigator.clipboard?.writeText(url);
    setStatus("Share link copied.");
    track('share_link_copy', { tool_name: 'outdoor_workout_generator' });
  };

  const handleCopy = async () => {
    if (!workoutText) return;
    await navigator.clipboard?.writeText(workoutText);
    setStatus("Workout copied.");
    track('copy_workout', { tool_name: 'outdoor_workout_generator' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!workoutText) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(workoutText, 180);
    doc.setFont("helvetica", "bold");
    doc.text("DB's Workouts", 14, 16);
    doc.setFont("helvetica", "normal");
    doc.text(lines, 14, 28);
    doc.save("db-workouts-outdoor-workout.pdf");
    setStatus("PDF downloaded.");
    track('pdf_download', { tool_name: 'outdoor_workout_generator' });
  };

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
            Personalised outdoor sessions
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Outdoor Workout Generator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Generate outdoor workouts with warm up, sets, reps, rest, finisher, cooldown and calories burned.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-14">
        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={handleGenerate} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Build Your Workout</h2>
              <p className="mt-1 text-sm text-zinc-500">Choose your goal, level, time, kit and location.</p>
            </div>

            <div className="space-y-5">
              <Field label="Goal" error={submitted && !form.goal ? "Choose a goal." : ""}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(GOALS).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.goal === key} onClick={() => updateForm("goal", key)}>{label}</ChoiceButton>
                  ))}
                </div>
              </Field>

              <Field label="Fitness Level" error={submitted && !form.level ? "Choose a level." : ""}>
                <div className="grid gap-2 sm:grid-cols-3">
                  {Object.entries(LEVELS).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.level === key} onClick={() => updateForm("level", key)}>{label}</ChoiceButton>
                  ))}
                </div>
              </Field>

              <Field label="Workout Length" error={submitted && !form.length ? "Choose a length." : ""}>
                <div className="grid grid-cols-5 gap-2">
                  {LENGTHS.map((length) => (
                    <ChoiceButton key={length} selected={Number(form.length) === length} onClick={() => updateForm("length", String(length))}>{length}</ChoiceButton>
                  ))}
                </div>
              </Field>

              <Field label="Equipment" error={submitted && !form.equipment ? "Choose equipment." : ""}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(EQUIPMENT).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.equipment === key} onClick={() => updateForm("equipment", key)}>{label}</ChoiceButton>
                  ))}
                </div>
              </Field>

              <Field label="Location" error={submitted && !form.location ? "Choose location." : ""}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(LOCATIONS).map(([key, label]) => (
                    <ChoiceButton key={key} selected={form.location === key} onClick={() => updateForm("location", key)}>{label}</ChoiceButton>
                  ))}
                </div>
              </Field>
            </div>

            <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              Generate New Workout <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
            {status && <p className="mt-3 text-center text-xs font-bold text-zinc-500">{status}</p>}
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
            <h2 className="text-2xl font-black text-white">Workout Results</h2>
            <p className="mt-1 text-sm text-zinc-500">Your personalised outdoor session will appear here.</p>
            {workout ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/30 p-5 text-sm leading-6 text-zinc-500">
                Complete the form to generate a workout.
              </div>
            )}
          </section>
        </section>

        {workout && (
          <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-white">Your Outdoor Workout</h2>
                <p className="mt-1 text-sm text-zinc-500">{GOALS[form.goal]} • {LEVELS[form.level]} • {form.length} minutes • {LOCATIONS[form.location]}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button type="button" onClick={handleGenerate} className="rounded-md border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-900"><RefreshCw className="mr-1 inline h-3.5 w-3.5" />Generate New Workout</button>
                <button type="button" onClick={handleDownloadPdf} className="rounded-md border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-900"><Download className="mr-1 inline h-3.5 w-3.5" />Download PDF</button>
                <button type="button" onClick={handleCopy} className="rounded-md border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-900"><Copy className="mr-1 inline h-3.5 w-3.5" />Copy Workout</button>
                <button type="button" onClick={handlePrint} className="rounded-md border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-900"><Printer className="mr-1 inline h-3.5 w-3.5" />Print</button>
                <button type="button" onClick={handleShare} className="rounded-md border border-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-900"><Share2 className="mr-1 inline h-3.5 w-3.5" />Share Link</button>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <article className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <h3 className="text-sm font-black text-white">Warm up</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{workout.warmUp}</p>
              </article>
              <article className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <h3 className="text-sm font-black text-white">Workout</h3>
                <div className="mt-3 grid gap-2">
                  {workout.workout.map((item) => (
                    <div key={item.name} className="rounded-lg bg-zinc-950/70 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-white">{item.name}</span>
                        <span className="text-xs font-bold text-[#F0F8FF]">{item.sets} sets</span>
                      </div>
                      <p className="mt-1 text-zinc-500">Reps: {item.reps} • Rest: {item.rest}</p>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <h3 className="text-sm font-black text-white">Finisher</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{workout.finisher}</p>
              </article>
              <article className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <h3 className="text-sm font-black text-white">Cooldown</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{workout.cooldown}</p>
              </article>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">How This Outdoor Workout Generator Works</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            The generator matches outdoor-friendly exercises to your goal, fitness level, workout length, equipment and location. Each new workout reshuffles the session structure so you can train outside without repeating the same plan.
          </p>
        </section>

        <RelatedTools tools={RELATED} />

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6" aria-labelledby="outdoor-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
          <h2 id="outdoor-faq" className="mt-2 text-2xl font-black text-white">Outdoor Workout Questions</h2>
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
