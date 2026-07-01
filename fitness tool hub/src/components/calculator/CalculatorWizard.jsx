// @ts-nocheck
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ACTIVITY_LABELS, EQUIPMENT_OPTIONS, GOAL_LABELS } from "@/lib/calculator";

function Field({ label, children, error = "" }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-zinc-300">{label}</Label>
      {children}
      {error && <p className="text-xs text-[#D0182E]">{error}</p>}
    </div>
  );
}

function Choice({ selected, children, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] ${
        selected ? "border-[#B30018] bg-[#B30018] text-white" : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function CalculatorWizard({ data, onChange, onCalculate, isCalculating }) {
  const [step, setStep] = useState(0);
  const ageValid = data.age >= 16 && data.age <= 90;
  const heightValid = data.height_cm >= 120 && data.height_cm <= 230;
  const weightValid = data.weight_kg >= 35 && data.weight_kg <= 250;
  const stepOneValid = ageValid && data.sex && heightValid && weightValid;
  const stepTwoValid = data.activity_level && data.training_goal && data.workout_days && (data.equipment || []).length > 0;
  const summaryItems = useMemo(() => [
    ["Age", data.age],
    ["Sex", data.sex],
    ["Height", `${data.height_cm} cm`],
    ["Weight", `${data.weight_kg} kg`],
    ["Goal", GOAL_LABELS[data.training_goal]],
    ["Training", `${data.workout_days} days/week`],
    ["Equipment", (data.equipment || []).join(", ")],
  ], [data]);

  const toggleEquipment = (item) => {
    const selected = data.equipment || [];
    onChange({ equipment: selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item] });
  };

  return (
    <section id="calculator" className="mx-auto max-w-2xl px-4 pb-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
        <div className="mb-6 grid grid-cols-3 gap-2">
          {["Details", "Goals", "Summary"].map((label, index) => (
            <div key={label} className={`rounded-full px-3 py-2 text-center text-xs font-bold ${step === index ? "bg-white text-zinc-950" : index < step ? "bg-[#B30018] text-white" : "bg-zinc-900 text-zinc-500"}`}>
              {label}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="details" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-white">Personal Details</h2>
                <p className="mt-1 text-sm text-zinc-500">Your details help estimate calorie needs accurately.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Age" error={data.age && !ageValid ? "Enter 16 to 90." : ""}>
                  <Input type="number" min="16" max="90" value={data.age || ""} onChange={(e) => onChange({ age: Number(e.target.value) })} className="bg-zinc-900 border-zinc-800 text-white" />
                </Field>
                <Field label="Sex">
                  <div className="grid grid-cols-2 gap-2">
                    {["male", "female"].map((sex) => <Choice key={sex} selected={data.sex === sex} onClick={() => onChange({ sex })}>{sex[0].toUpperCase() + sex.slice(1)}</Choice>)}
                  </div>
                </Field>
                <Field label="Height (cm)" error={data.height_cm && !heightValid ? "Enter 120 to 230 cm." : ""}>
                  <Input type="number" min="120" max="230" value={data.height_cm || ""} onChange={(e) => onChange({ height_cm: Number(e.target.value) })} className="bg-zinc-900 border-zinc-800 text-white" />
                </Field>
                <Field label="Weight (kg)" error={data.weight_kg && !weightValid ? "Enter 35 to 250 kg." : ""}>
                  <Input type="number" min="35" max="250" value={data.weight_kg || ""} onChange={(e) => onChange({ weight_kg: Number(e.target.value) })} className="bg-zinc-900 border-zinc-800 text-white" />
                </Field>
              </div>
              <Button disabled={!stepOneValid} onClick={() => setStep(1)} className="w-full bg-[#B30018] py-6 text-white hover:bg-[#940014]">Continue <ArrowRight className="h-4 w-4" /></Button>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="goals" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-white">Activity & Training</h2>
                <p className="mt-1 text-sm text-zinc-500">Choose the closest match. You can update this later.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300">Activity Level</Label>
                {Object.entries(ACTIVITY_LABELS).map(([key, label]) => <Choice key={key} selected={data.activity_level === key} onClick={() => onChange({ activity_level: key })} className="w-full text-left">{label}</Choice>)}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Goal">
                  <div className="grid gap-2">
                    {Object.entries(GOAL_LABELS).map(([key, label]) => <Choice key={key} selected={data.training_goal === key} onClick={() => onChange({ training_goal: key })}>{label}</Choice>)}
                  </div>
                </Field>
                <Field label={`Training Days: ${data.workout_days || 3}`}>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-5">
                    <Slider min={1} max={7} step={1} value={[data.workout_days || 3]} onValueChange={([value]) => onChange({ workout_days: value })} />
                    <div className="mt-3 flex justify-between text-[10px] text-zinc-600"><span>1</span><span>3</span><span>5</span><span>7</span></div>
                  </div>
                </Field>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300">Equipment</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EQUIPMENT_OPTIONS.map((item) => <Choice key={item} selected={(data.equipment || []).includes(item)} onClick={() => toggleEquipment(item)}>{item}</Choice>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="border-zinc-800 py-6 text-zinc-300 hover:bg-zinc-900"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button disabled={!stepTwoValid} onClick={() => setStep(2)} className="bg-[#B30018] py-6 text-white hover:bg-[#940014]">Summary <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="summary" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-white">Summary</h2>
                <p className="mt-1 text-sm text-zinc-500">Review your inputs before calculating.</p>
              </div>
              <div className="grid gap-2">
                {summaryItems.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm">
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-right font-semibold capitalize text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-800 py-6 text-zinc-300 hover:bg-zinc-900"><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button disabled={isCalculating} onClick={onCalculate} className="bg-[#B30018] py-6 text-white hover:bg-[#940014]">
                  {isCalculating ? <>Calculating <Loader2 className="h-4 w-4 animate-spin" /></> : "Calculate"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
