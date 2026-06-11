import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const GENERATOR_URL = "https://pt-ai-helper-63y9umrdw-deans-projects-30127c36.vercel.app";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(179,0,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(179,0,24,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#b30018]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#10b981]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b30018]/10 border border-[#b30018]/20 text-[#ff6666] text-xs font-bold uppercase tracking-wider mb-8"
        >
          <Zap className="w-3.5 h-3.5" />
          Built by a REPs Certified East London PT · Powered by AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold tracking-tight leading-[0.95] mb-6"
        >
          <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-[5rem]">
            Your AI Personal Trainer.
          </span>
          <span className="block text-[#b30018] text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] mt-1">
            Always On.
          </span>
          <span className="block text-[#10b981] text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] mt-1">
            Always Personalised.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#94a3b8] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Personalised workout and nutrition plans, powered by AI.
          <br className="hidden sm:block" />
          Designed by Dean Burt — DB's Workouts, East London.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#pricing"
            className="group relative inline-flex items-center gap-2 bg-[#b30018] hover:bg-[#9c0015] text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#b30018]/25 hover:shadow-[#b30018]/40 min-h-[48px]"
          >
            <Zap className="w-5 h-5" aria-hidden="true" />
            Get Started — £7.99/month
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>
          <a
            href={GENERATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-[#10b981]/50 text-white hover:text-[#10b981] font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 min-h-[48px]"
          >
            Try Free Version
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-[#b30018]/20 via-[#10b981]/10 to-transparent rounded-3xl blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1322] p-8 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#b30018]/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#b30018]" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">AI Workout Plan</div>
                <div className="text-[#94a3b8] text-xs">Generated in seconds</div>
              </div>
            </div>
            {[
              { day: "Monday", workout: "Upper Body Strength — Bench, OHP, Rows", tag: "Strength" },
              { day: "Wednesday", workout: "Lower Body — Squats, Deadlifts, Lunges", tag: "Strength" },
              { day: "Friday", workout: "Full Body HIIT + Core", tag: "Cardio" },
            ].map((item) => (
              <div key={item.day} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-white text-sm font-medium">{item.day}</div>
                  <div className="text-[#94a3b8] text-xs mt-0.5">{item.workout}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#b30018]/20 text-[#ff6666]">{item.tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#b30018]"
          />
        </div>
      </motion.div>
    </section>
  );
}
