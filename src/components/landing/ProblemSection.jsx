import React from "react";
import { motion } from "framer-motion";
import { UserX, Copy, Banknote } from "lucide-react";

const problems = [
  {
    icon: UserX,
    title: "Generic workouts don't account for your body",
    description: "Cookie-cutter plans ignore your injuries, goals, and experience level.",
  },
  {
    icon: Copy,
    title: "Free apps give everyone the same plan",
    description: "One-size-fits-all programs can't adapt to your progress or preferences.",
  },
  {
    icon: Banknote,
    title: "Hiring a PT every day isn't affordable",
    description: "Quality personal training costs hundreds per month — not everyone can access it.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ef4444]/80 font-display">
            The Problem
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-3xl sm:text-4xl md:text-[3rem] text-white text-center mb-16 leading-tight"
        >
          Most People Fail Because
          <br />
          <span className="text-[#94a3b8]">They Don't Have a Plan</span>
        </motion.h2>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative bg-[#0d1322] border border-white/5 rounded-2xl p-8 h-full transition-all duration-500 hover:border-[#ef4444]/20 hover:shadow-lg hover:shadow-[#ef4444]/5">
                <div className="w-14 h-14 rounded-xl bg-[#ef4444]/10 flex items-center justify-center mb-6 group-hover:bg-[#ef4444]/20 transition-colors duration-500">
                  <problem.icon className="w-7 h-7 text-[#ef4444]/70 group-hover:text-[#ef4444] transition-colors duration-500" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-3 leading-snug">
                  {problem.title}
                </h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gradient divider */}
        <div className="flex flex-col items-center">
          <div className="gradient-line w-full max-w-md h-[2px] rounded-full mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl md:text-3xl text-center"
          >
            <span className="text-white">FitAI </span>
            <span className="text-[#10b981]">fixes all three.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}