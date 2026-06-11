import { motion } from "framer-motion";
import { Flame, Beef, Wheat, Droplets, Coffee, Sun, Moon, Apple } from "lucide-react";

const goalLabels = {
  lose_fat:        { label: "Fat Loss", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  build_muscle:    { label: "Muscle Building", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  maintain:        { label: "Maintenance", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  improve_fitness: { label: "Fitness", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
};

function MacroBar({ label, grams, calories, color, icon: Icon, total }) {
  const pct = Math.round((calories / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-foreground">{grams}g</span>
          <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
        </div>
      </div>
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
        />
      </div>
    </div>
  );
}

const mealIcons = [
  { key: "breakfast", label: "Breakfast",       MealIcon: Coffee },
  { key: "snack1",    label: "Morning Snack",   MealIcon: Apple },
  { key: "lunch",     label: "Lunch",           MealIcon: Sun },
  { key: "snack2",    label: "Afternoon Snack", MealIcon: Apple },
  { key: "dinner",    label: "Dinner",          MealIcon: Moon },
];

export default function NutritionPlan({ data }) {
  const { calories, tdee, macros, meals, hydration, goal } = data;
  const { protein, carbs, fat } = macros;
  const goalInfo = goalLabels[goal] || goalLabels.maintain;

  const proteinCal = protein * 4;
  const carbsCal   = carbs * 4;
  const fatCal     = fat * 9;

  return (
    <div className="space-y-6">
      {/* Calorie overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-sm"
      >
        <h3 className="font-heading text-base font-bold text-muted-foreground uppercase tracking-wide mb-4">Daily Calorie Target</h3>
        <div className="flex items-end gap-3">
          <div className="flex items-end gap-2">
            <span className="font-heading text-5xl font-black text-foreground">{calories.toLocaleString()}</span>
            <span className="text-lg text-muted-foreground mb-1">kcal</span>
          </div>
          <div className={`ml-auto px-3 py-1.5 rounded-xl text-sm font-semibold border ${goalInfo.bg} ${goalInfo.color}`}>
            {goalInfo.label}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your TDEE (total daily energy expenditure) is estimated at <strong>{tdee.toLocaleString()} kcal</strong>.
        </p>
      </motion.div>

      {/* Macros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-sm"
      >
        <h3 className="font-heading text-base font-bold text-muted-foreground uppercase tracking-wide mb-5">Macro Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Protein", value: protein, unit: "g", sub: `${proteinCal} kcal`, color: "bg-blue-500", textColor: "text-blue-600" },
            { label: "Carbs",   value: carbs,   unit: "g", sub: `${carbsCal} kcal`,   color: "bg-amber-400", textColor: "text-amber-600" },
            { label: "Fat",     value: fat,     unit: "g", sub: `${fatCal} kcal`,     color: "bg-rose-400",  textColor: "text-rose-600" },
          ].map(m => (
            <div key={m.label} className="text-center p-4 rounded-xl bg-secondary/50">
              <div className={`text-3xl font-heading font-black ${m.textColor}`}>{m.value}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">{m.unit} {m.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <MacroBar label="Protein" grams={protein} calories={proteinCal} color="text-blue-500"  icon={Beef}  total={calories} />
          <MacroBar label="Carbs"   grams={carbs}   calories={carbsCal}   color="text-amber-500" icon={Wheat} total={calories} />
          <MacroBar label="Fat"     grams={fat}     calories={fatCal}     color="text-rose-500"  icon={Flame} total={calories} />
        </div>
      </motion.div>

      {/* Sample Meal Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
      >
        <div className="px-6 py-4 border-b border-border bg-secondary/30">
          <h3 className="font-heading text-base font-bold text-muted-foreground uppercase tracking-wide">Sample Day of Eating</h3>
        </div>
        <div className="divide-y divide-border">
          {mealIcons.map(({ key, label, MealIcon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="flex gap-4 px-6 py-4"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <MealIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-0.5">{label}</div>
                <p className="text-sm text-foreground">{meals[key]}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {meals.notes && (
          <div className="px-6 py-4 bg-secondary/40 border-t border-border">
            <p className="text-xs text-muted-foreground italic">💡 {meals.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Hydration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-4 p-5 rounded-2xl bg-sky-50 border border-sky-200"
      >
        <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
          <Droplets className="w-6 h-6 text-sky-500" />
        </div>
        <div>
          <div className="font-semibold text-sky-800 text-sm">Daily Hydration</div>
          <div className="text-sky-700 text-base font-bold">{hydration}</div>
        </div>
      </motion.div>
    </div>
  );
}