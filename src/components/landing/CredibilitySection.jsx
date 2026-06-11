import React from "react";
import { motion } from "framer-motion";
import { Star, Shield, Award } from "lucide-react";

export default function CredibilitySection() {
  return (
    <section id="credibility" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10b981] font-display">
            The Human Behind The AI
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-3xl sm:text-4xl md:text-[3rem] text-white text-center mb-16 leading-tight"
        >
          Built By a Real PT,
          <br />
          <span className="text-[#94a3b8]">Not Just a Developer</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-3 bg-gradient-to-br from-[#b30018]/20 to-[#10b981]/20 rounded-3xl blur-xl" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] max-w-md mx-auto lg:mx-0 bg-[#0d1322] flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-24 h-24 rounded-full bg-[#b30018]/20 border-2 border-[#b30018]/30 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#b30018]">DB</span>
                </div>
                <p className="text-white font-bold text-lg">Dean Burt</p>
                <p className="text-[#94a3b8] text-sm">DB's Workouts</p>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-[#0d1322]/90 backdrop-blur border border-white/10 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#10b981]" aria-hidden="true" />
                    <div>
                      <p className="text-white font-semibold text-sm">REPs Level 3 Certified PT</p>
                      <p className="text-[#94a3b8] text-xs">East London, UK</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              I'm <span className="text-[#b30018] font-semibold">Dean</span>, a REPs Level 3 qualified personal trainer based in East London
              with 12+ years of experience and over 68 five-star Google reviews.
            </p>
            <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed">
              I built DB's AI to give everyone access to professional-level planning
              at a fraction of the cost. Every workout, every meal plan, every check-in
              is built on the same principles I use with my in-person clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-3 bg-[#0d1322] border border-white/5 rounded-xl px-5 py-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">5.0 Rating</p>
                  <p className="text-[#94a3b8] text-xs">68 Google Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0d1322] border border-white/5 rounded-xl px-5 py-4">
                <Award className="w-8 h-8 text-[#10b981]" aria-hidden="true" />
                <div>
                  <p className="text-white font-bold text-sm">12+ Years</p>
                  <p className="text-[#94a3b8] text-xs">Personal Training</p>
                </div>
              </div>
            </div>

            <a
              href="https://dbworkouts.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Visit dbworkouts.co.uk →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
