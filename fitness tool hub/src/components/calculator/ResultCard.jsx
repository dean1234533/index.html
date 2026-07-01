import React from "react";

export default function ResultCard({ icon: Icon, label, value, helper, progress = 0, tone = "red" }) {
  const colours = {
    red: "from-[#B30018] to-[#D0182E]",
    blue: "from-sky-500 to-blue-500",
    amber: "from-amber-400 to-orange-500",
    slate: "from-zinc-500 to-zinc-300",
  };

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-[#F0F8FF]">{value}</p>
          {helper && <p className="mt-1 text-xs leading-relaxed text-zinc-500">{helper}</p>}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-black">
            <Icon className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="mt-4 h-2 rounded-full bg-zinc-800" aria-hidden="true">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${colours[tone] || colours.red}`}
          style={{ width: `${Math.min(Math.max(progress, 8), 100)}%` }}
        />
      </div>
    </article>
  );
}
