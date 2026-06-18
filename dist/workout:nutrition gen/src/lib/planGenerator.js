// ─── WORKOUT TEMPLATES ───────────────────────────────────────────────────────

const exerciseLibrary = {
  // Strength / Hypertrophy
  squat:          { name: "Barbell Back Squat",       muscle: "Quads, Glutes",      type: "compound" },
  deadlift:       { name: "Deadlift",                  muscle: "Posterior chain",    type: "compound" },
  benchPress:     { name: "Barbell Bench Press",       muscle: "Chest, Triceps",     type: "compound" },
  ohp:            { name: "Overhead Press",            muscle: "Shoulders, Triceps", type: "compound" },
  bentRow:        { name: "Barbell Bent-Over Row",     muscle: "Back, Biceps",       type: "compound" },
  pullUp:         { name: "Pull-Up / Lat Pulldown",    muscle: "Back, Biceps",       type: "compound" },
  dipChest:       { name: "Dips (chest lean)",         muscle: "Chest, Triceps",     type: "compound" },
  lunges:         { name: "Walking Lunges",            muscle: "Quads, Glutes",      type: "compound" },
  romanianDL:     { name: "Romanian Deadlift",         muscle: "Hamstrings, Glutes", type: "compound" },
  inclinePress:   { name: "Incline Dumbbell Press",    muscle: "Upper Chest",        type: "isolation" },
  cableRow:       { name: "Seated Cable Row",          muscle: "Mid Back",           type: "isolation" },
  legPress:       { name: "Leg Press",                 muscle: "Quads",              type: "isolation" },
  legCurl:        { name: "Lying Leg Curl",            muscle: "Hamstrings",         type: "isolation" },
  calfRaise:      { name: "Standing Calf Raise",       muscle: "Calves",             type: "isolation" },
  lateralRaise:   { name: "Lateral Raises",            muscle: "Side Delts",         type: "isolation" },
  facePull:       { name: "Face Pulls",                muscle: "Rear Delts, Rotator Cuff", type: "isolation" },
  bicepCurl:      { name: "Dumbbell Bicep Curl",       muscle: "Biceps",             type: "isolation" },
  tricepPushdown: { name: "Tricep Pushdown",           muscle: "Triceps",            type: "isolation" },
  abCrunch:       { name: "Cable Crunch / Sit-Up",     muscle: "Core",               type: "isolation" },
  plank:          { name: "Plank",                     muscle: "Core",               type: "stability" },
  // Bodyweight / Fat Loss
  pushUp:         { name: "Push-Up",                   muscle: "Chest, Triceps",     type: "compound" },
  bodyweightSq:   { name: "Bodyweight Squat",          muscle: "Quads, Glutes",      type: "compound" },
  gluteBridge:    { name: "Glute Bridge",              muscle: "Glutes, Hamstrings", type: "compound" },
  mountainClimb:  { name: "Mountain Climbers",         muscle: "Core, Cardio",       type: "cardio" },
  jumpingJack:    { name: "Jumping Jacks",             muscle: "Full Body",          type: "cardio" },
  burpee:         { name: "Burpees",                   muscle: "Full Body",          type: "cardio" },
  highKnees:      { name: "High Knees",                muscle: "Core, Cardio",       type: "cardio" },
  jumpRope:       { name: "Jump Rope / Skips",         muscle: "Full Body",          type: "cardio" },
  boxJump:        { name: "Box Jump",                  muscle: "Quads, Power",       type: "power" },
  hipThrust:      { name: "Hip Thrust (barbell)",      muscle: "Glutes",             type: "compound" },
};

// Sets/reps by goal + level
function getSetsReps(goal, level) {
  const table = {
    lose_fat: {
      beginner:     { sets: 3, reps: "12–15", rest: "45 sec" },
      intermediate: { sets: 4, reps: "12–15", rest: "30 sec" },
      advanced:     { sets: 4, reps: "15–20", rest: "20 sec" },
    },
    build_muscle: {
      beginner:     { sets: 3, reps: "8–12",  rest: "60–90 sec" },
      intermediate: { sets: 4, reps: "8–12",  rest: "60–90 sec" },
      advanced:     { sets: 4, reps: "6–10",  rest: "90–120 sec" },
    },
    maintain: {
      beginner:     { sets: 3, reps: "10–12", rest: "60 sec" },
      intermediate: { sets: 3, reps: "10–12", rest: "60 sec" },
      advanced:     { sets: 3, reps: "8–12",  rest: "60 sec" },
    },
    improve_fitness: {
      beginner:     { sets: 3, reps: "10–15", rest: "45 sec" },
      intermediate: { sets: 3, reps: "12–15", rest: "30 sec" },
      advanced:     { sets: 4, reps: "15–20", rest: "20 sec" },
    },
  };
  return table[goal]?.[level] || { sets: 3, reps: "10–12", rest: "60 sec" };
}

// Cardio finisher by goal/level
function getCardioFinisher(goal, level) {
  if (goal === "lose_fat") {
    const map = { beginner: "15 min steady-state cardio (treadmill/bike)", intermediate: "20 min HIIT (30s on / 30s off)", advanced: "25 min HIIT or 5 km run" };
    return map[level];
  }
  if (goal === "improve_fitness") {
    const map = { beginner: "10 min brisk walk or light jog", intermediate: "15 min HIIT intervals", advanced: "20 min HIIT or 5 km run" };
    return map[level];
  }
  return null;
}

// Weekly schedule templates
const scheduleTemplates = {
  3: ["Monday", "Wednesday", "Friday"],
  4: ["Monday", "Tuesday", "Thursday", "Friday"],
  5: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
};

// Exercise selection per day-slot based on goal + level + days
function buildWorkoutDays(goal, level, trainingDays) {
  const sr = getSetsReps(goal, level);
  const cardio = getCardioFinisher(goal, level);
  const days = scheduleTemplates[trainingDays];

  // Helper
  const ex = (key, note) => ({ ...exerciseLibrary[key], sets: sr.sets, reps: sr.reps, rest: sr.rest, note: note || null });

  // ─── TEMPLATES ────────────────────────────────────────────────────────────

  // BUILD MUSCLE ─ 3 days (Push/Pull/Legs)
  const musclePPL3 = [
    { label: "Push (Chest, Shoulders, Triceps)", exercises: [ex("benchPress"), ex("ohp"), ex("inclinePress"), ex("lateralRaise"), ex("tricepPushdown"), ex("facePull")] },
    { label: "Pull (Back, Biceps)", exercises: [ex("bentRow"), ex("pullUp"), ex("cableRow"), ex("facePull"), ex("bicepCurl")] },
    { label: "Legs (Quads, Hamstrings, Glutes)", exercises: [ex("squat"), ex("romanianDL"), ex("legPress"), ex("legCurl"), ex("calfRaise"), ex("abCrunch")] },
  ];

  // BUILD MUSCLE ─ 4 days (Upper/Lower x2)
  const muscleUL4 = [
    { label: "Upper A (Chest / Shoulder focus)", exercises: [ex("benchPress"), ex("ohp"), ex("inclinePress"), ex("lateralRaise"), ex("tricepPushdown"), ex("facePull")] },
    { label: "Lower A (Quad focus)", exercises: [ex("squat"), ex("legPress"), ex("lunges"), ex("legCurl"), ex("calfRaise"), ex("plank")] },
    { label: "Upper B (Back / Bicep focus)", exercises: [ex("bentRow"), ex("pullUp"), ex("cableRow"), ex("bicepCurl"), ex("facePull"), ex("abCrunch")] },
    { label: "Lower B (Posterior Chain focus)", exercises: [ex("deadlift"), ex("romanianDL"), ex("hipThrust"), ex("legCurl"), ex("calfRaise"), ex("plank")] },
  ];

  // BUILD MUSCLE ─ 5 days (PPL + Upper/Lower)
  const musclePPL5 = [
    { label: "Push (Chest, Shoulders, Triceps)", exercises: [ex("benchPress"), ex("inclinePress"), ex("ohp"), ex("lateralRaise"), ex("tricepPushdown"), ex("dipChest")] },
    { label: "Pull (Back, Biceps)", exercises: [ex("deadlift"), ex("bentRow"), ex("pullUp"), ex("cableRow"), ex("bicepCurl"), ex("facePull")] },
    { label: "Legs", exercises: [ex("squat"), ex("romanianDL"), ex("legPress"), ex("legCurl"), ex("hipThrust"), ex("calfRaise")] },
    { label: "Upper (Strength focus)", exercises: [ex("benchPress"), ex("ohp"), ex("bentRow"), ex("pullUp"), ex("lateralRaise"), ex("abCrunch")] },
    { label: "Lower (Volume focus)", exercises: [ex("squat"), ex("lunges"), ex("legPress"), ex("romanianDL"), ex("calfRaise"), ex("plank")] },
  ];

  // LOSE FAT ─ circuit-style
  const fatLoss3 = [
    { label: "Full Body Circuit A", exercises: [ex("squat"), ex("pushUp"), ex("bentRow"), ex("lunges"), ex("plank"), ex("mountainClimb")] },
    { label: "Full Body Circuit B", exercises: [ex("deadlift"), ex("inclinePress"), ex("pullUp"), ex("gluteBridge"), ex("burpee"), ex("highKnees")] },
    { label: "Full Body Circuit C", exercises: [ex("ohp"), ex("bodyweightSq"), ex("cableRow"), ex("hipThrust"), ex("jumpingJack"), ex("abCrunch")] },
  ];
  const fatLoss4 = [
    { label: "Upper Body Circuit A", exercises: [ex("benchPress"), ex("bentRow"), ex("ohp"), ex("pullUp"), ex("tricepPushdown"), ex("bicepCurl")] },
    { label: "Lower Body Circuit A", exercises: [ex("squat"), ex("lunges"), ex("romanianDL"), ex("gluteBridge"), ex("calfRaise"), ex("plank")] },
    { label: "Upper Body Circuit B", exercises: [ex("inclinePress"), ex("cableRow"), ex("lateralRaise"), ex("facePull"), ex("dipChest"), ex("abCrunch")] },
    { label: "Lower Body Circuit B + Core", exercises: [ex("deadlift"), ex("legPress"), ex("hipThrust"), ex("legCurl"), ex("mountainClimb"), ex("burpee")] },
  ];
  const fatLoss5 = [
    { label: "Full Body HIIT A", exercises: [ex("squat"), ex("pushUp"), ex("burpee"), ex("mountainClimb"), ex("jumpingJack"), ex("plank")] },
    { label: "Upper Strength", exercises: [ex("benchPress"), ex("bentRow"), ex("ohp"), ex("pullUp"), ex("lateralRaise"), ex("facePull")] },
    { label: "Lower Strength", exercises: [ex("squat"), ex("romanianDL"), ex("lunges"), ex("legCurl"), ex("calfRaise"), ex("gluteBridge")] },
    { label: "Full Body HIIT B", exercises: [ex("bodyweightSq"), ex("highKnees"), ex("burpee"), ex("mountainClimb"), ex("jumpRope"), ex("abCrunch")] },
    { label: "Compound Strength", exercises: [ex("deadlift"), ex("inclinePress"), ex("cableRow"), ex("ohp"), ex("hipThrust"), ex("plank")] },
  ];

  // MAINTAIN / IMPROVE FITNESS ─ balanced
  const general3 = [
    { label: "Full Body A", exercises: [ex("squat"), ex("benchPress"), ex("bentRow"), ex("ohp"), ex("calfRaise"), ex("plank")] },
    { label: "Full Body B", exercises: [ex("deadlift"), ex("inclinePress"), ex("pullUp"), ex("lunges"), ex("lateralRaise"), ex("abCrunch")] },
    { label: "Full Body C", exercises: [ex("legPress"), ex("dipChest"), ex("cableRow"), ex("hipThrust"), ex("facePull"), ex("plank")] },
  ];
  const general4 = [
    { label: "Upper Body A", exercises: [ex("benchPress"), ex("bentRow"), ex("ohp"), ex("pullUp"), ex("lateralRaise"), ex("tricepPushdown")] },
    { label: "Lower Body A", exercises: [ex("squat"), ex("romanianDL"), ex("legPress"), ex("legCurl"), ex("calfRaise"), ex("plank")] },
    { label: "Upper Body B", exercises: [ex("inclinePress"), ex("cableRow"), ex("facePull"), ex("bicepCurl"), ex("dipChest"), ex("abCrunch")] },
    { label: "Lower Body B", exercises: [ex("deadlift"), ex("lunges"), ex("hipThrust"), ex("legCurl"), ex("calfRaise"), ex("plank")] },
  ];
  const general5 = [
    { label: "Push A", exercises: [ex("benchPress"), ex("ohp"), ex("inclinePress"), ex("lateralRaise"), ex("tricepPushdown"), ex("facePull")] },
    { label: "Pull A", exercises: [ex("deadlift"), ex("bentRow"), ex("pullUp"), ex("cableRow"), ex("bicepCurl"), ex("facePull")] },
    { label: "Legs A", exercises: [ex("squat"), ex("legPress"), ex("lunges"), ex("legCurl"), ex("calfRaise"), ex("plank")] },
    { label: "Push B + Core", exercises: [ex("inclinePress"), ex("dipChest"), ex("ohp"), ex("lateralRaise"), ex("abCrunch"), ex("plank")] },
    { label: "Pull B + Glutes", exercises: [ex("bentRow"), ex("pullUp"), ex("hipThrust"), ex("romanianDL"), ex("bicepCurl"), ex("abCrunch")] },
  ];

  // Lookup
  const templateMap = {
    build_muscle: { 3: musclePPL3, 4: muscleUL4, 5: musclePPL5 },
    lose_fat:     { 3: fatLoss3,   4: fatLoss4,  5: fatLoss5 },
    maintain:     { 3: general3,   4: general4,  5: general5 },
    improve_fitness: { 3: general3, 4: general4, 5: general5 },
  };

  const slots = templateMap[goal]?.[trainingDays] || general3;

  return days.map((day, i) => ({
    day,
    ...slots[i],
    cardioFinisher: cardio,
  }));
}

// ─── NUTRITION CALCULATOR ────────────────────────────────────────────────────

function calcBMR(gender, weight, height, age) {
  // Mifflin-St Jeor
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function calcTDEE(bmr, trainingDays) {
  // Activity multiplier
  const mult = trainingDays === 3 ? 1.55 : trainingDays === 4 ? 1.65 : 1.725;
  return Math.round(bmr * mult);
}

function calcCalories(tdee, goal) {
  const map = {
    lose_fat:       Math.round(tdee * 0.8),
    build_muscle:   Math.round(tdee * 1.1),
    maintain:       tdee,
    improve_fitness: Math.round(tdee * 0.95),
  };
  return map[goal] || tdee;
}

function calcMacros(calories, weight, goal) {
  // Protein: 1.8–2.2g/kg; Fat: 25–30% of calories; Carbs: remainder
  const proteinMultiplier = goal === "build_muscle" ? 2.2 : goal === "lose_fat" ? 2.0 : 1.8;
  const protein = Math.round(weight * proteinMultiplier);
  const fatCalPercent = goal === "lose_fat" ? 0.30 : 0.25;
  const fat = Math.round((calories * fatCalPercent) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { protein, carbs, fat };
}

const mealPlans = {
  lose_fat: {
    breakfast: "Scrambled eggs (3 whole + 2 whites) + 1 slice wholegrain toast + black coffee",
    snack1:    "Greek yogurt (0% fat) with a handful of berries",
    lunch:     "Grilled chicken breast (150 g) + large mixed salad + olive oil dressing",
    snack2:    "Apple + 20 g almonds",
    dinner:    "Baked salmon (150 g) + steamed broccoli + 80 g cooked brown rice",
    notes:     "Keep meals high-protein & high-fibre to stay full on fewer calories.",
  },
  build_muscle: {
    breakfast: "Oats (80 g dry) with whole milk, 2 scoops whey protein, banana",
    snack1:    "4 rice cakes + 2 tbsp peanut butter + glass of whole milk",
    lunch:     "Beef mince (200 g) stir-fry + white rice (150 g cooked) + mixed veg",
    snack2:    "Cottage cheese (200 g) + pineapple chunks",
    dinner:    "Chicken thighs (200 g) + sweet potato (200 g) + asparagus",
    notes:     "Eat a carb + protein meal within 1 hour post-workout for optimal recovery.",
  },
  maintain: {
    breakfast: "2 whole eggs + 2 egg whites scrambled + wholegrain toast + orange",
    snack1:    "Handful of mixed nuts + an apple",
    lunch:     "Tuna wrap (tuna, avocado, salad leaves in wholegrain tortilla)",
    snack2:    "Low-fat yogurt + granola",
    dinner:    "Grilled chicken (150 g) + quinoa (100 g cooked) + roasted veg",
    notes:     "Balance macros across meals and prioritise whole foods.",
  },
  improve_fitness: {
    breakfast: "Porridge with banana, honey, and a scoop of protein powder",
    snack1:    "Protein bar or boiled egg with fruit",
    lunch:     "Turkey & avocado sandwich on wholegrain bread + side salad",
    snack2:    "Carrot sticks + hummus",
    dinner:    "Baked cod (150 g) + roasted sweet potato + green beans",
    notes:     "Fuel training sessions with carbs pre-workout; rebuild with protein post-workout.",
  },
};

function calcHydration(weight, trainingDays) {
  const base = Math.round((weight * 0.033 + trainingDays * 0.3) * 10) / 10;
  return `${base.toFixed(1)} litres per day (add ~500 ml extra on training days)`;
}

// ─── MAIN GENERATOR ──────────────────────────────────────────────────────────

export function generatePlan(inputs) {
  const { goal, gender, age, weight, height, level, trainingDays, injuries } = inputs;

  // Workout
  const workoutDays = buildWorkoutDays(goal, level, trainingDays);
  const restDays = 7 - trainingDays;

  // Nutrition
  const bmr = calcBMR(gender, weight, height, age);
  const tdee = calcTDEE(bmr, trainingDays);
  const calories = calcCalories(tdee, goal);
  const macros = calcMacros(calories, weight, goal);
  const meals = mealPlans[goal];
  const hydration = calcHydration(weight, trainingDays);

  const injuryNote = injuries?.trim()
    ? `⚠️ You mentioned: "${injuries}". Substitute or skip any exercise that causes discomfort, and consult a physiotherapist if needed.`
    : null;

  return {
    workout: {
      days: workoutDays,
      restDays,
      injuryNote,
      trainingDays,
    },
    nutrition: {
      calories,
      tdee,
      macros,
      meals,
      hydration,
      goal,
    },
  };
}