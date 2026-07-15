import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function RelatedTools({ tools }) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
      <h2 className="text-xl font-black text-white">Related Tools</h2>
      <p className="mt-1 text-sm text-zinc-500">Other free tools from DB's Workouts.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              to={tool.href}
              className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-black/30 p-4 transition-colors hover:border-[#B30018]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                  <Icon className="h-4 w-4 text-[#B30018]" aria-hidden="true" />
                </div>
                <span className="truncate text-sm font-bold text-zinc-200 group-hover:text-white">{tool.name}</span>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-zinc-600 transition-colors group-hover:text-[#B30018]" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
