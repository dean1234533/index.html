export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  fat_loss: -0.2,
  muscle_gain: 0.1,
  maintenance: 0,
  body_recomp: -0.05,
  athletic_performance: 0.15,
};

export function calculateResults(data) {
  const { age, sex, height_cm, weight_kg, activity_level, training_goal, workout_days, equipment } = data;
  const days = Math.min(Math.max(Number(workout_days) || 3, 1), 7);

  // Mifflin-St Jeor
  let bmr;
  if (sex === "male") {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }

  const maintenance = Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity_level] || 1.2));
  const adjustment = GOAL_ADJUSTMENTS[training_goal] || 0;
  const goalCalories = Math.round(maintenance * (1 + adjustment));

  // Macros
  let proteinPerKg, fatPercent;
  switch (training_goal) {
    case "fat_loss":
      proteinPerKg = 2.2;
      fatPercent = 0.25;
      break;
    case "muscle_gain":
      proteinPerKg = 2.0;
      fatPercent = 0.25;
      break;
    case "body_recomp":
      proteinPerKg = 2.2;
      fatPercent = 0.25;
      break;
    case "athletic_performance":
      proteinPerKg = 1.8;
      fatPercent = 0.2;
      break;
    default:
      proteinPerKg = 1.6;
      fatPercent = 0.3;
  }

  const protein_g = Math.round(weight_kg * proteinPerKg);
  const fat_g = Math.round((goalCalories * fatPercent) / 9);
  const remainingCals = goalCalories - protein_g * 4 - fat_g * 9;
  const carbs_g = Math.round(Math.max(remainingCals, 0) / 4);

  const trainingDetails = generateTrainingPlan(training_goal, days, equipment || []);
  const macroCalories = {
    protein: protein_g * 4,
    carbs: carbs_g * 4,
    fat: fat_g * 9,
  };
  const macroTotal = Math.max(macroCalories.protein + macroCalories.carbs + macroCalories.fat, 1);
  const macro_percentages = {
    protein: Math.round((macroCalories.protein / macroTotal) * 100),
    carbs: Math.round((macroCalories.carbs / macroTotal) * 100),
    fat: Math.round((macroCalories.fat / macroTotal) * 100),
  };

  return {
    maintenance_calories: maintenance,
    goal_calories: goalCalories,
    protein_g,
    carbs_g,
    fat_g,
    macro_calories: macroCalories,
    macro_percentages,
    calorie_summary: [
      { label: "Maintenance", value: maintenance },
      { label: "Goal", value: goalCalories },
    ],
    training_recommendation: trainingDetails.summary,
    workout_split: trainingDetails.splits,
    practical_advice: generatePracticalAdvice({
      goal: training_goal,
      days,
      equipment: equipment || [],
      weight_kg,
      protein_g,
      carbs_g,
      fat_g,
      goalCalories,
      splits: trainingDetails.splits,
    }),
  };
}

function generateTrainingPlan(goal, days, equipment) {
  const hasGym = equipment.includes("Full Gym");
  const hasBarbell = equipment.includes("Barbell & Rack");
  const hasDumbbells = equipment.includes("Dumbbells");
  const hasKettlebells = equipment.includes("Kettlebells");
  const hasBands = equipment.includes("Resistance Bands");
  const bodyweightOnly = equipment.includes("Bodyweight Only") || equipment.length === 0;

  let splits;
  if (days === 1) {
    splits = ["Full Body Strength + Conditioning"];
  } else if (days === 2) {
    splits = ["Full Body Strength", "Full Body Strength + Conditioning"];
  } else if (days === 3) {
    splits = ["Push + Quads", "Pull + Hamstrings", "Full Body"];
  } else if (days === 4) {
    splits = ["Upper Body", "Lower Body", "Upper Body", "Lower Body"];
  } else if (days === 5) {
    splits = ["Push", "Pull", "Legs", "Upper Body", "Lower Body"];
  } else {
    splits = ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
    if (days === 7) splits.push("Active Recovery / Mobility");
  }

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const splitRows = splits.map((session, i) => ({ day: dayLabels[i], session }));
  const plan = splitRows.map((row) => `${row.day}: ${row.session}`).join("\n");

  let equipNote = "";
  if (hasGym || hasBarbell) {
    equipNote = "Use compound lifts such as squats, deadlifts, presses, rows, and hip hinges as your main movements.";
  } else if (hasDumbbells) {
    equipNote = "Focus on dumbbell compound movements: goblet squats, dumbbell rows, presses, Romanian deadlifts, and lunges.";
  } else if (hasKettlebells) {
    equipNote = "Build sessions around swings, goblet squats, presses, rows, carries, and controlled single-leg work.";
  } else if (hasBands) {
    equipNote = "Use banded squats, pull-aparts, rows, and presses for progressive resistance.";
  } else if (bodyweightOnly) {
    equipNote = "Bodyweight focus: push-ups, squats, lunges, pull-ups (if available), planks, burpees.";
  } else {
    equipNote = "Use your available kit for controlled full-body strength work and progress reps, sets, or tempo over time.";
  }

  let goalNote = "";
  switch (goal) {
    case "fat_loss":
      goalNote = "Keep rest periods short (30-60s), prioritise steps and recovery, and add 2-3 short cardio sessions if recovery allows.";
      break;
    case "muscle_gain":
      goalNote = "Focus on progressive overload, controlled form, and 3-4 sets of 8-12 reps for most working movements.";
      break;
    case "body_recomp":
      goalNote = "Mix strength work (heavy, low rep) with hypertrophy (moderate weight, higher rep). Add 1-2 cardio sessions.";
      break;
    case "athletic_performance":
      goalNote = "Include power/explosive movements. Periodise intensity. Add sport-specific conditioning.";
      break;
    default:
      goalNote = "Maintain current training intensity, keep form sharp, and use the plan to stay consistent week to week.";
  }

  return {
    splits: splitRows,
    summary: `Weekly Split (${days} days):\n${plan}\n\nEquipment: ${equipNote}\n\nGoal Focus: ${goalNote}`,
  };
}

function generatePracticalAdvice({ goal, days, equipment, weight_kg, protein_g, carbs_g, fat_g, goalCalories, splits }) {
  const proteinFoods = [
    "Chicken breast or turkey",
    "Eggs or egg whites",
    "Greek yoghurt or cottage cheese",
    "Tuna, salmon or white fish",
    "Lean beef mince",
    "Tofu, tempeh, lentils or beans",
    "Whey or plant protein shake",
  ];

  const mealPlan = [
    `Breakfast: Greek yoghurt with berries, oats and a scoop of protein powder.`,
    `Lunch: Chicken, rice, salad and olive oil dressing.`,
    `Snack: Fruit plus cottage cheese, eggs or a protein shake.`,
    `Dinner: Lean protein with potatoes or pasta, vegetables and a moderate serving of healthy fats.`,
  ];

  const hydrationLitres = Math.max(2, Math.round(weight_kg * 0.035 * 10) / 10);
  const equipmentNote = equipment.includes("Bodyweight Only")
    ? "Use tempo, pauses and higher reps to make bodyweight exercises challenging."
    : equipment.includes("Full Gym") || equipment.includes("Barbell & Rack")
      ? "Prioritise big compound lifts and track load, reps and form each week."
      : "Progress by adding reps, sets, slower tempo or more challenging exercise variations.";

  const goalTips = {
    fat_loss: [
      "Keep protein high and build meals around lean protein and high-volume vegetables.",
      "Aim for a daily step target before adding lots of extra high-intensity cardio.",
      "Use the calorie target as a weekly average rather than panicking over one imperfect day.",
    ],
    muscle_gain: [
      "Train close to failure on key lifts while keeping form controlled.",
      "Track performance and aim to add reps or load over time.",
      "Keep the surplus controlled so strength climbs without unnecessary fat gain.",
    ],
    maintenance: [
      "Use maintenance calories to stabilise energy, performance and body weight.",
      "Keep training quality high and review measurements every few weeks.",
      "This is a good phase for building habits before a more focused goal.",
    ],
    body_recomp: [
      "Keep protein high and make strength progress the main training target.",
      "Expect slower scale changes because fat loss and muscle gain can overlap.",
      "Photos, measurements and gym performance may tell the story better than weight alone.",
    ],
    athletic_performance: [
      "Place most carbohydrates around harder sessions to support output.",
      "Build recovery into the week so conditioning does not crush strength work.",
      "Use mobility, warm-ups and sleep as performance tools, not afterthoughts.",
    ],
  };

  return {
    meal_plan: mealPlan,
    protein_foods: proteinFoods,
    hydration: `Aim for around ${hydrationLitres} litres of water per day as a baseline, then add more when training outdoors, sweating heavily or drinking caffeine.`,
    workout_split: splits,
    recovery: `Train ${days} day${days === 1 ? "" : "s"} per week, leave at least one easier day when possible, sleep 7-9 hours, and reduce intensity if soreness or fatigue keeps building.`,
    fitness_tips: [
      ...(goalTips[goal] || goalTips.maintenance),
      equipmentNote,
      `Use ${goalCalories} kcal, ${protein_g}g protein, ${carbs_g}g carbs and ${fat_g}g fat as a starting point for two to four weeks before adjusting.`,
    ],
  };
}

export function encodeResults(data) {
  return btoa(JSON.stringify(data));
}

export function decodeResults(encoded) {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

export const ACTIVITY_LABELS = {
  sedentary: "Sedentary (desk job, little exercise)",
  lightly_active: "Lightly Active (1-3 days/week)",
  moderately_active: "Moderately Active (3-5 days/week)",
  very_active: "Very Active (6-7 days/week)",
  extremely_active: "Extremely Active (athlete / physical job)",
};

export const GOAL_LABELS = {
  fat_loss: "Fat Loss",
  muscle_gain: "Muscle Gain",
  maintenance: "Maintenance",
  body_recomp: "Body Recomposition",
  athletic_performance: "Athletic Performance",
};

export const EQUIPMENT_OPTIONS = [
  "Full Gym",
  "Dumbbells",
  "Resistance Bands",
  "Kettlebells",
  "Barbell & Rack",
  "Bodyweight Only",
];
