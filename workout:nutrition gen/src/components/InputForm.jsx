import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Target, User, Scale, Ruler, Calendar, AlertCircle, Zap } from "lucide-react";

const GOALS = [
  { value: "lose_fat",       label: "Lose Fat",        emoji: "🔥", color: "from-orange-500 to-red-500" },
  { value: "build_muscle",   label: "Build Muscle",    emoji: "💪", color: "from-blue-500 to-indigo-600" },
  { value: "maintain",       label: "Maintain",        emoji: "⚖️", color: "from-emerald-500 to-teal-500" },
  { value: "improve_fitness",label: "Improve Fitness", emoji: "⚡", color: "from-purple-500 to-violet-600" },
];

const LEVELS = [
  { value: "beginner",     label: "Beginner",     desc: "< 1 year training" },
  { value: "intermediate", label: "Intermediate", desc: "1–3 years training" },
  { value: "advanced",     label: "Advanced",     desc: "3+ years training" },
];

const DAYS = [3, 4, 5];

export default function InputForm({ onGenerate }) {
  const [form, setForm] = useState({
    goal: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    level: "",
    trainingDays: 3,
    injuries: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.goal)   e.goal   = "Please select a goal";
    if (!form.gender) e.gender = "Please select a gender";
    if (!form.age || form.age < 10 || form.age > 90)  e.age    = "Enter age between 10–90";
    if (!form.weight || form.weight < 30 || form.weight > 300) e.weight = "Enter weight 30–300 kg";
    if (!form.height || form.height < 100 || form.height > 250) e.height = "Enter height 100–250 cm";
    if (!form.level) e.level = "Please select a fitness level";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onGenerate({
      ...form,
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      trainingDays: parseInt(form.trainingDays),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Goal */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" /> Your Goal
        </label>
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => set("goal", g.value)}
              className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 border-2 ${
                form.goal === g.value
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
              }`}
            >
              <div className="text-2xl mb-1">{g.emoji}</div>
              <div className="font-semibold text-sm text-foreground">{g.label}</div>
              {form.goal === g.value && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
        {errors.goal && <p className="text-destructive text-xs mt-2">{errors.goal}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Gender
        </label>
        <div className="flex gap-3">
          {["male", "female"].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set("gender", g)}
              className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm capitalize transition-all duration-200 ${
                form.gender === g
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {g === "male" ? "♂ Male" : "♀ Female"}
            </button>
          ))}
        </div>
        {errors.gender && <p className="text-destructive text-xs mt-2">{errors.gender}</p>}
      </div>

      {/* Age / Weight / Height */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={e => set("age", e.target.value)}
            placeholder="25"
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
              errors.age ? "border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
            <Scale className="w-3 h-3" /> Weight (kg)
          </label>
          <input
            type="number"
            value={form.weight}
            onChange={e => set("weight", e.target.value)}
            placeholder="75"
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
              errors.weight ? "border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.weight && <p className="text-destructive text-xs mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
            <Ruler className="w-3 h-3" /> Height (cm)
          </label>
          <input
            type="number"
            value={form.height}
            onChange={e => set("height", e.target.value)}
            placeholder="175"
            className={`w-full rounded-xl border-2 px-4 py-3 text-sm bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-colors ${
              errors.height ? "border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.height && <p className="text-destructive text-xs mt-1">{errors.height}</p>}
        </div>
      </div>

      {/* Fitness Level */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-primary" /> Fitness Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map(l => (
            <button
              key={l.value}
              type="button"
              onClick={() => set("level", l.value)}
              className={`py-3 px-2 rounded-xl border-2 text-center transition-all duration-200 ${
                form.level === l.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`font-semibold text-sm ${form.level === l.value ? "text-primary" : "text-foreground"}`}>{l.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
        {errors.level && <p className="text-destructive text-xs mt-2">{errors.level}</p>}
      </div>

      {/* Training Days */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Training Days per Week
        </label>
        <div className="flex gap-3">
          {DAYS.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => set("trainingDays", d)}
              className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all duration-200 ${
                form.trainingDays === d
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30"
              }`}
            >
              {d}
              <span className="block text-xs font-normal">days</span>
            </button>
          ))}
        </div>
      </div>

      {/* Injuries */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" /> Injuries / Limitations <span className="text-muted-foreground font-normal text-xs">(optional)</span>
        </label>
        <textarea
          value={form.injuries}
          onChange={e => set("injuries", e.target.value)}
          placeholder="e.g. bad knees, shoulder impingement, lower back pain..."
          rows={3}
          className="w-full rounded-xl border-2 border-border px-4 py-3 text-sm bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
      >
        <Zap className="w-5 h-5" />
        Generate My Plan
      </motion.button>
    </form>
  );
}