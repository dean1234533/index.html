import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FreeToolCTA() {
  return (
    <section id="free-tool" className="relative py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6]/20 via-[#10b981]/20 to-[#3b82f6]/20 rounded-3xl blur-lg" />
          
          <div className="relative bg-[#0d1322] border border-white/5 rounded-3xl p-10 md:p-16 text-center">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#10b981]/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#10b981]/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#10b981]/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#10b981]/30 rounded-br-lg" />

            <div className="w-14 h-14 rounded-2xl bg-[#10b981]/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-7 h-7 text-[#10b981]" aria-hidden="true" />
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
              Not Ready to Commit?
              <br />
              <span className="text-[#10b981]">Try the Free Version First</span>
            </h2>

            <p className="text-[#94a3b8] text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Get a solid workout and nutrition plan completely free — no account needed.
            </p>

            <a
              href="https://dbworkouts-free-generator.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-2 border-[#10b981] hover:bg-[#10b981] text-[#10b981] hover:text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 min-h-[48px]"
            >
              Try Free Plan Generator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}