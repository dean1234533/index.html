import React from "react";
import { motion } from "framer-motion";
import { Brain, UtensilsCrossed, CalendarCheck, TrendingUp, RefreshCw, Camera } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Workout Plans",
    description: "Personalised training programmes that adapt to your level, equipment, and goals in real time.",
    accent: "blue",
  },
  {
    icon: UtensilsCrossed,
    title: "7-Day Meal Plans",
    description: "Custom nutrition plans built around your calories, macros, dietary needs, and food preferences.",
    accent: "green",
  },
  {
    icon: CalendarCheck,
    title: "Weekly Check-ins",
    description: "Track your weight, energy, and performance weekly so your plan evolves with you.",
    accent: "blue",
  },
  {
    icon: TrendingUp,
    title: "Progressive Overload",
    description: "Smart load management ensures you're always progressing — never plateauing.",
    accent: "green",
  },
  {
    icon: RefreshCw,
    title: "Meal Swaps",
    description: "Don't like a meal? Swap it instantly for something that fits your macros and taste.",
    accent: "blue",
  },
  {
    icon: Camera,
    title: "Progress Photo Analysis",
    description: "Upload photos and let AI track visual changes in your physique over time.",
    accent: "green",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 px-6">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3b82f6]/3 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#10b981]/3 rounded-full blur-[120px]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3b82f6] font-display">
            Feature Set
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-3xl sm:text-4xl md:text-[3rem] text-white text-center mb-4 leading-tight"
        >
          Everything You Need to
          <br />
          <span className="text-[#10b981]">Transform Your Body</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#94a3b8] text-center text-base md:text-lg max-w-xl mx-auto mb-16"
        >
          Six powerful tools working together like your own personal training team.
        </motion.p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isBlue = feature.accent === "blue";
            const accentColor = isBlue ? "#3b82f6" : "#10b981";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className="glass-card relative border border-white/5 rounded-2xl p-8 h-full transition-all duration-500 hover:border-white/10 pulse-border"
                  style={{ "--tw-shadow-color": `${accentColor}20` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <feature.icon
                      className="w-6 h-6 transition-colors duration-500"
                      style={{ color: accentColor }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}