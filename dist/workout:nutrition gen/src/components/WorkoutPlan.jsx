import { motion } from "framer-motion";
import { Clock, RotateCcw, AlertTriangle, Dumbbell } from "lucide-react";

const goalColors = {
  lose_fat:        "bg-orange-100 text-orange-700 border-orange-200",
  build_muscle:    "bg-blue-100 text-blue-700 border-blue-200",
  maintain:        "bg-emerald-100 text-emerald-700 border-emerald-200",
  improve_fitness: "bg-purple-100 text-purple-700 border-purple-200",
};

const typeColors = {
  compound:  "bg-blue-50 text-blue-600",
  isolation: "bg-violet-50 text-violet-600",
  cardio:    "bg-orange-50 text-orange-600",
  power:     "bg-red-50 text-red-600",
  stability: "bg-teal-50 text-teal-600",
};

export default function WorkoutPlan({ data, goal }) {
  const { days, restDays, injuryNote } = data;

  return (
    <div className="space-y-6">
      {injuryNote && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <p>{injuryNote}</p>
        </motion.div>
      )}

      {days.map((day, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
        >
          {/* Day header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Day {i + 1}</span>
              <h3 className="font-heading text-lg font-bold text-foreground mt-0.5">{day.day}</h3>
              <p className="text-sm text-primary font-medium mt-0.5">{day.label}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-heading font-black text-foreground">{day.exercises.length}</div>
              <div className="text-xs text-muted-foreground">exercises</div>
            </div>
          </div>

          {/* Exercises */}
          <div className="divide-y divide-border">
            {day.exercises.map((ex, j) => (
              <div key={j} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{j + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{ex.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[ex.type] || "bg-muted text-muted-foreground"}`}>
                      {ex.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{ex.muscle}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div className="text-sm font-bold text-foreground">{ex.sets} × {ex.reps}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                      <Clock className="w-3 h-3" /> {ex.rest}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cardio finisher */}
          {day.cardioFinisher && (
            <div className="px-5 py-3 bg-orange-50 border-t border-orange-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="text-sm text-orange-700 font-medium">Cardio Finisher: {day.cardioFinisher}</span>
            </div>
          )}
        </motion.div>
      ))}

      {/* Rest days note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: days.length * 0.07 + 0.1 }}
        className="p-4 rounded-xl bg-secondary border border-border text-center"
      >
        <Dumbbell className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{restDays} rest days</span> per week — active recovery recommended (walking, light stretching, yoga).
        </p>
      </motion.div>
    </div>
  );
}