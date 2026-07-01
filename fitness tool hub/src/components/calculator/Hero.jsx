import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const BADGES = ["Free", "No Signup", "Created by DB's Workouts"];

export default function Hero({ onStart }) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-12 pt-12 text-center sm:pt-16">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <img src={import.meta.env.BASE_URL + 'logo.png'} alt="DB's Workouts" className="mx-auto mb-5 h-12 w-12 rounded-xl object-cover" />
        <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
          Free Macro & Calorie Calculator
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-400">
          Calculate your calories, macros and personalised training recommendations in less than 60 seconds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {BADGES.map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-[#F0F8FF]">
              <Check className="h-3.5 w-3.5 text-[#B30018]" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-[#B30018] px-7 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Start Calculator
        </button>
        <div className="mt-8 flex justify-center">
          <ChevronDown className="h-5 w-5 animate-bounce text-zinc-600" aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}
