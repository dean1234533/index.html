import React from "react";

const SEGMENTS = [
  { key: "protein", label: "Protein", color: "bg-[#B30018]" },
  { key: "carbs", label: "Carbs", color: "bg-amber-500" },
  { key: "fat", label: "Fat", color: "bg-sky-400" },
];

export default function MacroPieChart({ percentages }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h3 className="text-sm font-bold text-white">Macro Percentage Split</h3>
      <div className="mt-4 space-y-3" role="img" aria-label="Macro percentage bar chart">
        {SEGMENTS.map((segment) => {
          const value = percentages[segment.key] || 0;
          return (
            <div key={segment.key}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-zinc-300">{segment.label}</span>
                <span className="font-bold text-white">{value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div className={`h-full rounded-full ${segment.color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
