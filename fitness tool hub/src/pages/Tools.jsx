import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Lock, Search } from "lucide-react";

import Footer from "@/components/sections/Footer";
import { TOOLS_DATA } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "nutrition", label: "Nutrition" },
  { id: "body", label: "Body" },
  { id: "hydration", label: "Hydration" },
  { id: "training", label: "Training" },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Fitness Tools | DB's Workouts",
  url: "https://dbworkouts.co.uk/tools",
  description: "A hub of free fitness calculators and training tools from DB's Workouts.",
  publisher: {
    "@type": "Organization",
    name: "DB's Workouts",
    url: "https://dbworkouts.co.uk",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TOOLS_DATA.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://dbworkouts.co.uk${tool.href}`,
    })),
  },
};

function ToolCard({ tool }) {
  const Icon = tool.icon;
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-black">
          <Icon className="h-5 w-5 text-[#B30018]" aria-hidden="true" />
        </div>
        {tool.active ? (
          <span className="rounded-full bg-[#B30018] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-500">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Locked
          </span>
        )}
      </div>
      <div className="mt-5">
        <h2 className="text-lg font-black text-white">{tool.name}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{tool.description}</p>
      </div>
    </>
  );

  if (!tool.active) {
    return (
      <article aria-disabled="true" className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5 opacity-65">
        {content}
      </article>
    );
  }

  return (
    <Link
      to={tool.href}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition-colors hover:border-[#B30018]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]"
    >
      {content}
      <span className="mt-5 inline-flex text-sm font-bold text-[#D0182E] transition-colors group-hover:text-white">
        Open tool
      </span>
    </Link>
  );
}

export default function Tools() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  usePageSeo({
    title: "Fitness Tools | DB's Workouts",
    description: "Free DB's Workouts fitness tools for calories, macros, TDEE, protein, BMI, body fat, hydration, running pace and training.",
    canonical: "https://dbworkouts.co.uk/tools",
    schema,
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return TOOLS_DATA.filter((tool) => {
      const matchesQuery = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
      const matchesCategory = category === "all" || tool.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-12">
        <Link to="/" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="DB's Workouts" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <p className="text-sm font-black leading-none text-white">DB's Workouts</p>
            <p className="mt-1 text-[11px] font-medium leading-none text-zinc-500">Fitness Tools</p>
          </div>
        </Link>

        <div className="mt-12 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B30018]/30 bg-[#B30018]/10 px-3 py-1.5 text-xs font-bold text-[#F0F8FF]">
            <HeartPulse className="h-3.5 w-3.5 text-[#B30018]" aria-hidden="true" />
            Free tools from DB's Workouts
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Fitness Tools Hub
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Simple calculators for smarter training, nutrition and progress tracking. Each tool is added only when it is ready to use.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search fitness tools"
              className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#B30018] focus:ring-2 focus:ring-[#B30018]/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                aria-pressed={category === cat.id}
                className={`flex-shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] ${
                  category === cat.id
                    ? "border-[#B30018] bg-[#B30018] text-white"
                    : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center">
            <p className="text-sm text-zinc-500">No tools match your search. <button className="font-bold text-[#D0182E] hover:text-white" onClick={() => { setQuery(""); setCategory("all"); }}>Clear filters</button></p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
