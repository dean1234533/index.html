// @ts-nocheck
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics";
import {
  AlertCircle, AlertTriangle, Beef, Calendar, Clock, Coffee,
  Dumbbell, Droplets, Flame, Moon, RefreshCw, Ruler,
  Scale, Sun, Target, Wheat, Zap, Apple,
} from "lucide-react";
import { generatePlan } from "@/lib/planGenerator";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("workout-plan-generator");

// ─── SEO ──────────────────────────────────────────────────────────────────────

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Workout & Nutrition Plan Generator | DB's Workouts",
  url: "https://dbworkouts.co.uk/tools/workout-plan-generator",
  description:
    "Generate a free personalised weekly workout and nutrition plan in seconds. No login required.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  publisher: {
    "@type": "Organization",
    name: "DB's Workouts",
    url: "https://dbworkouts.co.uk",
  },
};

// ─── FORM CONSTANTS ────────────────────────────────────────────────────────────

const GOALS = [
  { value: "lose_fat",        label: "Lose Fat",        emoji: "🔥" },
  { value: "build_muscle",    label: "Build Muscle",    emoji: "💪" },
  { value: "maintain",        label: "Maintain",        emoji: "⚖️" },
  { value: "improve_fitness", label: "Improve Fitness", emoji: "⚡" },
];

const LEVELS = [
  { value: "beginner",     label: "Beginner",     desc: "< 1 yr" },
  { value: "intermediate", label: "Intermediate", desc: "1–3 yrs" },
  { value: "advanced",     label: "Advanced",     desc: "3+ yrs" },
];

const GOAL_LABELS = {
  lose_fat: "Fat Loss", build_muscle: "Muscle Building",
  maintain: "Maintenance", improve_fitness: "Improve Fitness",
};
const GOAL_EMOJIS = {
  lose_fat: "🔥", build_muscle: "💪", maintain: "⚖️", improve_fitness: "⚡",
};

// ─── SMALL HELPERS ─────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div>
      <span className="block text-sm font-semibold text-zinc-300 mb-2">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-[#D0182E]">{error}</span>}
    </div>
  );
}

function ChoiceBtn({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] ${
        selected
          ? "border-[#B30018] bg-[#B30018] text-white"
          : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600"
      }`}
    >
      {children}
    </button>
  );
}

function NumInput({ value, onChange, placeholder, error }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-11 w-full rounded-lg border px-3 text-sm font-semibold text-white bg-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-[#B30018]/30 ${
        error ? "border-[#D0182E]" : "border-zinc-800 focus:border-[#B30018]"
      }`}
    />
  );
}

// ─── INPUT FORM ────────────────────────────────────────────────────────────────

function InputForm({ onGenerate }) {
  const [form, setForm] = useState({
    goal: "", gender: "", age: "", weight: "", height: "",
    level: "", trainingDays: 3, injuries: "",
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.goal)   e.goal   = "Select a goal";
    if (!form.gender) e.gender = "Select a gender";
    if (!form.age    || +form.age    < 10  || +form.age    > 90)  e.age    = "Age 10–90";
    if (!form.weight || +form.weight < 30  || +form.weight > 300) e.weight = "Weight 30–300 kg";
    if (!form.height || +form.height < 100 || +form.height > 250) e.height = "Height 100–250 cm";
    if (!form.level) e.level = "Select a level";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onGenerate({ ...form, age: +form.age, weight: +form.weight, height: +form.height, trainingDays: +form.trainingDays });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Goal */}
      <Field label="Your Goal" error={errors.goal}>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map(g => (
            <ChoiceBtn key={g.value} selected={form.goal === g.value} onClick={() => set("goal", g.value)}>
              <span className="text-base">{g.emoji}</span>
              <span className="block text-xs mt-0.5">{g.label}</span>
            </ChoiceBtn>
          ))}
        </div>
      </Field>

      {/* Gender */}
      <Field label="Gender" error={errors.gender}>
        <div className="flex gap-2">
          {["male", "female"].map(g => (
            <ChoiceBtn key={g} selected={form.gender === g} onClick={() => set("gender", g)}>
              {g === "male" ? "♂ Male" : "♀ Female"}
            </ChoiceBtn>
          ))}
        </div>
      </Field>

      {/* Age / Weight / Height */}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Age" error={errors.age}>
          <NumInput value={form.age} onChange={v => set("age", v)} placeholder="25" error={errors.age} />
        </Field>
        <Field label="Weight (kg)" error={errors.weight}>
          <NumInput value={form.weight} onChange={v => set("weight", v)} placeholder="75" error={errors.weight} />
        </Field>
        <Field label="Height (cm)" error={errors.height}>
          <NumInput value={form.height} onChange={v => set("height", v)} placeholder="175" error={errors.height} />
        </Field>
      </div>

      {/* Fitness Level */}
      <Field label="Fitness Level" error={errors.level}>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map(l => (
            <ChoiceBtn key={l.value} selected={form.level === l.value} onClick={() => set("level", l.value)}>
              <span className="block font-bold text-xs">{l.label}</span>
              <span className="block font-normal text-[10px] mt-0.5 opacity-70">{l.desc}</span>
            </ChoiceBtn>
          ))}
        </div>
      </Field>

      {/* Training Days */}
      <Field label="Training Days / Week">
        <div className="flex gap-2">
          {[3, 4, 5].map(d => (
            <ChoiceBtn key={d} selected={form.trainingDays === d} onClick={() => set("trainingDays", d)}>
              <span className="text-lg font-black">{d}</span>
              <span className="block text-[10px] font-normal">days</span>
            </ChoiceBtn>
          ))}
        </div>
      </Field>

      {/* Injuries */}
      <div>
        <span className="block text-sm font-semibold text-zinc-300 mb-2">
          Injuries / Limitations <span className="text-zinc-500 font-normal text-xs">(optional)</span>
        </span>
        <textarea
          value={form.injuries}
          onChange={e => set("injuries", e.target.value)}
          placeholder="e.g. bad knees, shoulder impingement, lower back pain…"
          rows={3}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#B30018] focus:ring-2 focus:ring-[#B30018]/30 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full min-h-12 rounded-xl bg-[#B30018] font-bold text-white text-sm flex items-center justify-center gap-2 transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]"
      >
        <Zap className="w-4 h-4" />
        Generate My Plan
      </button>
    </form>
  );
}

// ─── WORKOUT PLAN ──────────────────────────────────────────────────────────────

const typeColors = {
  compound:  "bg-blue-900/40 text-blue-400",
  isolation: "bg-violet-900/40 text-violet-400",
  cardio:    "bg-orange-900/40 text-orange-400",
  power:     "bg-red-900/40 text-red-400",
  stability: "bg-teal-900/40 text-teal-400",
};

function WorkoutPlan({ data }) {
  const { days, restDays, injuryNote } = data;
  return (
    <div className="space-y-4">
      {injuryNote && (
        <div className="flex gap-3 p-4 rounded-xl bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <p>{injuryNote}</p>
        </div>
      )}
      {days.map((day, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/40">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Day {i + 1}</span>
              <h3 className="font-black text-white text-base mt-0.5">{day.day}</h3>
              <p className="text-xs text-[#B30018] font-semibold mt-0.5">{day.label}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">{day.exercises.length}</div>
              <div className="text-[10px] text-zinc-500">exercises</div>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {day.exercises.map((ex, j) => (
              <div key={j} className="flex items-center gap-4 px-5 py-3">
                <div className="w-6 h-6 rounded-md bg-[#B30018]/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#B30018]">{j + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white">{ex.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColors[ex.type] || "bg-zinc-800 text-zinc-400"}`}>
                      {ex.type}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">{ex.muscle}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-white">{ex.sets} × {ex.reps}</div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 justify-end">
                    <Clock className="w-2.5 h-2.5" /> {ex.rest}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {day.cardioFinisher && (
            <div className="px-5 py-3 bg-orange-900/20 border-t border-orange-800/30 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-xs text-orange-300 font-medium">Cardio Finisher: {day.cardioFinisher}</span>
            </div>
          )}
        </motion.div>
      ))}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-center">
        <Dumbbell className="w-5 h-5 mx-auto text-zinc-600 mb-2" />
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-white">{restDays} rest days</span> per week — active recovery recommended (walking, light stretching).
        </p>
      </div>
    </div>
  );
}

// ─── NUTRITION PLAN ────────────────────────────────────────────────────────────

function MacroBar({ label, grams, calories, barColor, total }) {
  const pct = Math.round((calories / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-300">{label}</span>
        <div>
          <span className="text-sm font-bold text-white">{grams}g</span>
          <span className="text-xs text-zinc-500 ml-1">({pct}%)</span>
        </div>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}

const mealMeta = [
  { key: "breakfast", label: "Breakfast",       Icon: Coffee },
  { key: "snack1",    label: "Morning Snack",   Icon: Apple },
  { key: "lunch",     label: "Lunch",           Icon: Sun },
  { key: "snack2",    label: "Afternoon Snack", Icon: Apple },
  { key: "dinner",    label: "Dinner",          Icon: Moon },
];

function NutritionPlan({ data }) {
  const { calories, tdee, macros, meals, hydration } = data;
  const { protein, carbs, fat } = macros;
  const proteinCal = protein * 4, carbsCal = carbs * 4, fatCal = fat * 9;

  return (
    <div className="space-y-4">
      {/* Calorie card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Daily Calorie Target</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-white">{calories.toLocaleString()}</span>
          <span className="text-lg text-zinc-400 mb-1">kcal</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Your TDEE is estimated at <strong className="text-zinc-300">{tdee.toLocaleString()} kcal</strong>.
        </p>
      </div>

      {/* Macros */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Macro Breakdown</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Protein", value: protein, kcal: proteinCal, color: "text-blue-400" },
            { label: "Carbs",   value: carbs,   kcal: carbsCal,   color: "text-amber-400" },
            { label: "Fat",     value: fat,     kcal: fatCal,     color: "text-rose-400" },
          ].map(m => (
            <div key={m.label} className="text-center p-3 rounded-xl bg-zinc-800/50">
              <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5">g {m.label}</div>
              <div className="text-[10px] text-zinc-600 mt-0.5">{m.kcal} kcal</div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <MacroBar label="Protein" grams={protein} calories={proteinCal} barColor="bg-blue-500"  total={calories} />
          <MacroBar label="Carbs"   grams={carbs}   calories={carbsCal}   barColor="bg-amber-400" total={calories} />
          <MacroBar label="Fat"     grams={fat}     calories={fatCal}     barColor="bg-rose-400"  total={calories} />
        </div>
      </div>

      {/* Meal plan */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/40">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sample Day of Eating</p>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {mealMeta.map(({ key, label, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex gap-4 px-6 py-4"
            >
              <div className="w-8 h-8 rounded-lg bg-[#B30018]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-[#B30018]" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 mb-0.5">{label}</div>
                <p className="text-sm text-zinc-200">{meals[key]}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {meals.notes && (
          <div className="px-6 py-4 bg-zinc-900/40 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 italic">💡 {meals.notes}</p>
          </div>
        )}
      </div>

      {/* Hydration */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-sky-900/20 border border-sky-800/40">
        <div className="w-11 h-11 rounded-xl bg-sky-900/40 flex items-center justify-center shrink-0">
          <Droplets className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <div className="font-semibold text-sky-300 text-sm">Daily Hydration</div>
          <div className="text-sky-200 text-base font-bold">{hydration}</div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "workout",   label: "🏋️ Workout Plan" },
  { key: "nutrition", label: "🥗 Nutrition Plan" },
];

export default function WorkoutPlanGenerator() {
  usePageSeo({
    title: "Free Workout & Nutrition Plan Generator | DB's Workouts",
    description:
      "Generate a personalised weekly workout and daily nutrition plan in seconds — free, no login required. Created by DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/workout-plan-generator",
    schema,
  });

  const [plan, setPlan]           = useState(null);
  const [inputs, setInputs]       = useState(null);
  const [activeTab, setActiveTab] = useState("workout");
  const resultsRef                = useRef(null);

  const handleGenerate = formInputs => {
    const result = generatePlan(formInputs);
    setInputs(formInputs);
    setPlan(result);
    track('tool_calculation', { tool_name: 'workout_plan_generator' });
    setActiveTab("workout");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleReset = () => {
    setPlan(null);
    setInputs(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-zinc-800/60">
        {/* Red glow accent */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#B30018]/15 blur-[120px]" />

        {/* Back link — left aligned */}
        <div className="relative mx-auto max-w-2xl px-4 pt-10">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]"
          >
            <img src={import.meta.env.BASE_URL + "logo.png"} alt="DB's Workouts" className="h-9 w-9 rounded-xl object-cover" />
            <div className="text-left">
              <p className="text-sm font-black leading-none text-white">DB's Workouts</p>
              <p className="mt-0.5 text-[11px] font-medium leading-none text-zinc-500">← Back to Fitness Tools</p>
            </div>
          </Link>
        </div>

        <div className="relative mx-auto max-w-2xl px-4 pb-14 text-center mt-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#B30018]/30 bg-[#B30018]/10 px-4 py-1.5 text-xs font-bold text-[#F0F8FF] mb-6"
          >
            <Dumbbell className="h-3.5 w-3.5 text-[#B30018]" />
            Free Plan Generator — No Login Required
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white"
          >
            Your Free Workout &amp;<br />
            <span className="text-[#B30018]">Nutrition Plan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-5 text-base leading-7 text-zinc-400 max-w-md mx-auto"
          >
            Fill in your details and get a personalised weekly training schedule and daily nutrition blueprint — instantly, for free.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {["No login", "Instant results", "Created by a REPs PT"].map(b => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B30018]" />
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">

        {/* Form / summary */}
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl shadow-black/40"
            >
              <InputForm onGenerate={handleGenerate} />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#B30018]/30 bg-[#B30018]/8 px-5 py-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#B30018] mb-0.5">Plan generated for</p>
                <p className="font-black text-white text-sm">
                  {GOAL_EMOJIS[inputs.goal]} {GOAL_LABELS[inputs.goal]} · {inputs.trainingDays}×/week · {inputs.level}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {inputs.age} yrs · {inputs.weight} kg · {inputs.height} cm · {inputs.gender}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-white hover:border-[#B30018]/50 transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Plan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {plan && (
            <motion.div
              ref={resultsRef}
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-[#B30018] text-white shadow-lg shadow-[#B30018]/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "workout" ? (
                  <motion.div key="workout" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
                    <WorkoutPlan data={plan.workout} />
                  </motion.div>
                ) : (
                  <motion.div key="nutrition" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                    <NutritionPlan data={plan.nutrition} />
                  </motion.div>
                )}
              </AnimatePresence>

              <CTA />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-zinc-600 pb-4">
          Plans are based on established training and nutrition principles. Consult a healthcare professional before starting a new fitness programme.
        </p>

        <div className="mx-auto max-w-2xl">
          <RelatedTools tools={RELATED} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
