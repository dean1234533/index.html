import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, ArrowRight, Loader2 } from "lucide-react";

const plans = [
  {
    id: "personal",
    name: "Personal Plan",
    price: "7.99",
    badge: null,
    description: "Everything you need to train smarter on your own.",
    features: [
      "AI-generated workout plans",
      "7-day personalised meal plans",
      "Weekly check-ins & adjustments",
      "Progressive overload tracking",
      "Meal swap suggestions",
      "Progress photo analysis",
    ],
    cta: "Get Started",
    accent: "red",
    popular: false,
  },
  {
    id: "pt_pro",
    name: "PT Pro",
    price: "24.99",
    badge: "Most Popular",
    description: "For PTs who want to scale with AI-powered client management.",
    features: [
      "Everything in Personal Plan",
      "Client dashboard & management",
      "Branded workout delivery",
      "Automated client check-ins",
      "Nutrition plan builder for clients",
      "Progress tracking per client",
      "Revenue analytics",
      "Priority support",
    ],
    cta: "Get Started",
    accent: "green",
    popular: true,
  },
];

async function startCheckout(planId, setLoading) {
  setLoading(planId);
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || 'Something went wrong. Please try again.');
      setLoading(null);
    }
  } catch {
    alert('Could not connect to payment server. Please try again.');
    setLoading(null);
  }
}

export default function PricingSection() {
  const [loading, setLoading] = useState(null);

  return (
    <section id="pricing" className="relative py-24 md:py-32 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b30018]/3 rounded-full blur-[150px]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b30018] font-display">
            Pricing
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-3xl sm:text-4xl md:text-[3rem] text-white text-center mb-4 leading-tight"
        >
          Simple, Honest Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#94a3b8] text-center text-base md:text-lg max-w-lg mx-auto mb-16"
        >
          Professional-level training and nutrition at a price that makes sense.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            const accentColor = plan.accent === "red" ? "#b30018" : "#10b981";
            const isLoading = loading === plan.id;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative rounded-2xl p-[1px] ${
                  isPopular
                    ? "bg-gradient-to-b from-[#b30018] via-[#10b981]/50 to-transparent"
                    : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#b30018] to-[#10b981] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                      <Crown className="w-3 h-3" aria-hidden="true" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-2xl p-8 md:p-10 ${
                    isPopular
                      ? "bg-[#0d1322]"
                      : "bg-[#0d1322] border border-white/5"
                  }`}
                >
                  <div className="mb-8">
                    <h3 className="font-display font-bold text-xl text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-[#94a3b8] text-sm mb-6">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[#94a3b8] text-lg">£</span>
                      <span className="font-display font-extrabold text-5xl text-white">
                        {plan.price}
                      </span>
                      <span className="text-[#94a3b8] text-base">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                          style={{ backgroundColor: `${accentColor}20` }}
                        >
                          <Check className="w-3 h-3" style={{ color: accentColor }} aria-hidden="true" />
                        </div>
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => startCheckout(plan.id, setLoading)}
                    disabled={!!loading}
                    className={`group flex items-center justify-center gap-2 w-full font-semibold text-base py-4 rounded-xl transition-all duration-300 min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed ${
                      isPopular
                        ? "bg-[#10b981] hover:bg-[#059669] text-white shadow-lg shadow-[#10b981]/25"
                        : "bg-[#b30018] hover:bg-[#9c0015] text-white shadow-lg shadow-[#b30018]/25"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" aria-hidden="true" />
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-[#94a3b8]/60 text-sm text-center mt-8"
        >
          No contracts. Cancel anytime. Secure payment via Stripe.
        </motion.p>
      </div>
    </section>
  );
}
