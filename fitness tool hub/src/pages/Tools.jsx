import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Calculator,
  Droplets,
  Flame,
  HeartPulse,
  Lock,
  Map,
  Route,
  Ruler,
  Scale,
  Target,
  TrendingUp,
} from "lucide-react";

import Footer from "@/components/sections/Footer";
import { usePageSeo } from "@/lib/seo";

const TOOLS = [
  {
    name: "Macro Calculator",
    description: "Calculate daily calories, macros and training recommendations.",
    href: "/tools/macro-calculator",
    icon: Calculator,
    active: true,
  },
  {
    name: "TDEE Calculator",
    description: "Estimate your total daily energy expenditure.",
    href: "/tools/tdee-calculator",
    icon: Flame,
    active: true,
  },
  {
    name: "Protein Calculator",
    description: "Find a practical daily protein target for your goal.",
    href: "/tools/protein-calculator",
    icon: Target,
    active: true,
  },
  {
    name: "BMI Calculator",
    description: "Check body mass index using height and weight.",
    href: "/tools/bmi-calculator",
    icon: Scale,
    active: true,
  },
  {
    name: "Body Fat Calculator",
    description: "Estimate body fat using simple body measurements.",
    href: "/tools/body-fat-calculator",
    icon: Ruler,
    active: true,
  },
  {
    name: "Water Intake Calculator",
    description: "Calculate a daily hydration target for training days.",
    href: "/tools/water-intake-calculator",
    icon: Droplets,
    active: true,
  },
  {
    name: "One Rep Max Calculator",
    description: "Estimate strength targets from reps and load.",
    href: "/tools/one-rep-max-calculator",
    icon: TrendingUp,
    active: true,
  },
  {
    name: "Running Pace Calculator",
    description: "Convert distance and time into pace splits.",
    href: "/tools/running-pace-calculator",
    icon: Route,
    active: true,
  },
  {
    name: "Calorie Burn Calculator",
    description: "Estimate calories burned from common activities.",
    href: "/tools/calorie-burn-calculator",
    icon: Activity,
    active: true,
  },
  {
    name: "Outdoor Workout Generator",
    description: "Create a simple outdoor session from your kit and time.",
    href: "/tools/outdoor-workout-generator",
    icon: Map,
    active: true,
  },
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
    itemListElement: TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: tool.href ? `https://dbworkouts.co.uk${tool.href}` : undefined,
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
  usePageSeo({
    title: "Fitness Tools | DB's Workouts",
    description: "Free DB's Workouts fitness tools for calories, macros, TDEE, protein, BMI, hydration, running pace and training.",
    canonical: "https://dbworkouts.co.uk/tools",
    schema,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-12">
        <Link to="/" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]">
          <img src="/logo.png" alt="DB's Workouts" className="h-10 w-10 rounded-xl object-cover" />
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
