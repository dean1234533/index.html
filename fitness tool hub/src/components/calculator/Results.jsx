import React from "react";
import { Activity, Beef, Droplets, Flame, Gauge, Moon, Route, Wheat } from "lucide-react";
import ResultCard from "@/components/calculator/ResultCard";
import MacroPieChart from "@/components/calculator/MacroPieChart";

export default function Results({ data, results }) {
  const hydration = results.practical_advice.hydration.match(/around ([0-9.]+) litres/)?.[1] || "2+";
  const progressText = data.training_goal === "fat_loss"
    ? "Approx. 0.4-0.7 kg/week"
    : data.training_goal === "muscle_gain"
      ? "Approx. 0.1-0.3 kg/week"
      : "Track photos and strength";
  const cards = [
    { label: "Daily Calories", value: `${results.goal_calories}`, helper: "kcal per day", icon: Flame, progress: 100, tone: "red" },
    { label: "Protein", value: `${results.protein_g}g`, helper: `${results.macro_percentages.protein}% of macros`, icon: Beef, progress: results.macro_percentages.protein, tone: "red" },
    { label: "Carbohydrates", value: `${results.carbs_g}g`, helper: `${results.macro_percentages.carbs}% of macros`, icon: Wheat, progress: results.macro_percentages.carbs, tone: "amber" },
    { label: "Fat", value: `${results.fat_g}g`, helper: `${results.macro_percentages.fat}% of macros`, icon: Droplets, progress: results.macro_percentages.fat, tone: "blue" },
    { label: "Estimated Weekly Progress", value: progressText, helper: "Healthy estimate", icon: Gauge, progress: 70, tone: "slate" },
    { label: "Hydration Target", value: `${hydration}L`, helper: "Daily baseline", icon: Droplets, progress: 80, tone: "blue" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 pb-12">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">Results</p>
        <h2 className="mt-2 text-3xl font-black text-white">Your Premium Training Dashboard</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => <ResultCard key={card.label} {...card} />)}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
        <MacroPieChart percentages={results.macro_percentages} />
        <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Route className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-white">Recommended Workout Split</h3>
          </div>
          <div className="grid gap-2">
            {results.workout_split.map((row) => (
              <div key={`${row.day}-${row.session}`} className="flex items-center justify-between rounded-lg bg-black/50 px-3 py-2 text-sm">
                <span className="font-bold text-white">{row.day}</span>
                <span className="text-right text-zinc-400">{row.session}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="mb-2 flex items-center gap-2"><Activity className="h-4 w-4 text-[#B30018]" /><h3 className="text-sm font-bold text-white">Training Advice</h3></div>
          <ul className="space-y-2 text-sm leading-relaxed text-zinc-400">
            {results.practical_advice.fitness_tips.slice(0, 3).map((tip) => <li key={tip}>• {tip}</li>)}
          </ul>
        </article>
        <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="mb-2 flex items-center gap-2"><Moon className="h-4 w-4 text-[#B30018]" /><h3 className="text-sm font-bold text-white">Recovery</h3></div>
          <p className="text-sm leading-relaxed text-zinc-400">{results.practical_advice.recovery}</p>
        </article>
      </div>
    </section>
  );
}
