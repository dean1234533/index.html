import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const LANDING_URL = "https://dbworkouts.co.uk/ai";

export default function CTABanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#b30018] via-[#7a000f] to-[#0a0a0a] p-8 text-white shadow-2xl shadow-[#b30018]/20"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-12 translate-y-12" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Upgrade your results</span>
        </div>

        <h2 className="font-display text-2xl font-black text-white mb-2 leading-tight">
          Want a fully personalised<br />AI coaching subscription?
        </h2>
        <p className="text-white/70 text-sm mb-6 max-w-sm">
          This free tool is a great starting point. <strong className="text-white">DB's AI Pro</strong> unlocks weekly adjustments, nutrition planning, progress tracking — powered by Dean's 12 years of PT expertise.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={LANDING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#b30018] font-bold text-sm hover:bg-white/90 transition-colors shadow-lg"
          >
            View Plans — from £7.99/mo
            <ArrowRight className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-4 text-white/60 text-xs">
            <span>✓ No contract</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
