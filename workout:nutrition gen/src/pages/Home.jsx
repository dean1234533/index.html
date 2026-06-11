import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, RefreshCw } from "lucide-react";
import InputForm from "@/components/InputForm";
import WorkoutPlan from "@/components/WorkoutPlan";
import NutritionPlan from "@/components/NutritionPlan";
import CTABanner from "@/components/CTABanner";
import { generatePlan } from "@/lib/planGenerator";

const TABS = [
  { key: "workout",   label: "🏋️ Workout Plan" },
  { key: "nutrition", label: "🥗 Nutrition Plan" },
];

const goalEmojis = {
  lose_fat: "🔥", build_muscle: "💪", maintain: "⚖️", improve_fitness: "⚡"
};
const goalLabels = {
  lose_fat: "Fat Loss", build_muscle: "Muscle Building", maintain: "Maintenance", improve_fitness: "Improve Fitness"
};

export default function Home() {
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("workout");
  const [inputs, setInputs] = useState(null);
  const resultsRef = useRef(null);

  const handleGenerate = (formInputs) => {
    const result = generatePlan(formInputs);
    setInputs(formInputs);
    setPlan(result);
    setActiveTab("workout");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setPlan(null);
    setInputs(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Free Plan Generator — No Login Required
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4"
          >
            Your Free Workout &<br />
            <span className="text-primary">Nutrition Plan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base max-w-md mx-auto"
          >
            Fill in your details below and get a personalised weekly training schedule and daily nutrition blueprint — instantly, for free.
          </motion.p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
        {/* Form */}
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm"
            >
              <InputForm onGenerate={handleGenerate} />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border p-5 flex items-center justify-between"
            >
              <div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Your plan for</div>
                <div className="font-heading text-lg font-bold text-foreground">
                  {goalEmojis[inputs.goal]} {goalLabels[inputs.goal]} · {inputs.trainingDays} days/week · {inputs.level}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {inputs.age} yrs · {inputs.weight} kg · {inputs.height} cm · {inputs.gender}
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New Plan</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {plan && (
            <motion.div
              ref={resultsRef}
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-secondary rounded-2xl">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "workout" ? (
                  <motion.div
                    key="workout"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WorkoutPlan data={plan.workout} goal={inputs.goal} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="nutrition"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NutritionPlan data={plan.nutrition} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Banner */}
              <CTABanner />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-6">
          Plans are generated based on established training and nutrition principles. Always consult a healthcare professional before starting a new fitness programme.
        </div>
      </div>
    </div>
  );
}