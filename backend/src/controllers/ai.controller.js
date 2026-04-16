// backend/controllers/ai.controller.js
import Workout from "../models/Workout.js";
import Nutrition from "../models/Nutrition.js";

// CONFIG
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// IN-MEMORY CACHE
const cache = new Map();
const cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

// RATE LIMIT
const rateLimit = new Map();
const MAX_CALLS_PER_MIN = 3;

// HELPER: Generate hash
const generateHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
};

// HELPER: Rate limit
const isRateLimited = (userId) => {
  const now = Date.now();
  const record = rateLimit.get(userId) || { count: 0, resetTime: now };

  if (now - record.resetTime > 60 * 1000) {
    rateLimit.set(userId, { count: 1, resetTime: now });
    return false;
  }

  if (record.count >= MAX_CALLS_PER_MIN) return true;

  rateLimit.set(userId, {
    count: record.count + 1,
    resetTime: record.resetTime,
  });
  return false;
};

// HELPER: Call Gemini
export const callGemini = async (prompt, userId) => {
  const hash = generateHash(prompt);
  const cacheKey = `${userId}-calorie-${hash}`;

  // CHECK CACHE
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cacheTTL) {
    console.log("Gemini: CACHE HIT (24h)");
    return cached.result;
  }

  // RATE LIMIT
  if (isRateLimited(userId)) {
    throw new Error("Rate limit exceeded. Try again in 1 minute.");
  }

  try {
    console.log("Gemini: API CALL");
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);

    const data = await response.json();
    const result = data.candidates[0].content.parts[0].text
      .replace(/```/g, "")
      .trim();

    // SAVE TO CACHE
    cache.set(cacheKey, { result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error("Gemini error:", err.message);
    throw new Error("AI service unavailable");
  }
};

// ---------------------------------------------
// CLEAN, REALISTIC & FULLY FIXED CALORIE ANALYSIS
// ---------------------------------------------
export const getCalorieBurnAnalysis = async (req, res) => {
  const userId = req.userId;
  const user = req.user;

  try {
    // -------------------------------
    // 1. Week Window (Mon → Sun)
    // -------------------------------
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - now.getDay() + 1);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // -------------------------------
    // 2. Fetch Logs
    // -------------------------------
    const [nutritions, workouts] = await Promise.all([
      Nutrition.find({
        user: userId,
        date: { $gte: weekStart, $lt: weekEnd },
      }),
      Workout.find({
        user: userId,
        status: "completed",
        date: { $gte: weekStart, $lt: weekEnd },
      }).sort({ date: 1 }),
    ]);

    const totalIntake = nutritions.reduce((s, n) => s + n.totalCalories, 0);

    // -------------------------------
    // 3. Profile Normalization
    // -------------------------------
    const profile = {
      weight: Number(user.weight) || 70,
      height: Number(user.height) || 170,
      age: Number(user.age) || 30,
      gender: user.gender || "male",
      activityLevel: user.activityLevel || "moderate",
      goal: (user.fitnessGoal || "maintenance").replace("_", " "),
    };

    // -------------------------------
    // 4. BMR Calculation (Mifflin-St Jeor)
    // -------------------------------
    let bmr =
      profile.gender === "female"
        ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
        : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;

    // Prevent impossible BMR errors
    bmr = Math.max(1100, Math.min(bmr, 2200)); // 1100–2200 human range

    // -------------------------------
    // 5. Activity Multiplier
    // -------------------------------
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let multiplier = activityMultipliers[profile.activityLevel] || 1.55;

    // Adjust gender difference
    if (profile.gender === "female") multiplier -= 0.05;
    if (profile.gender === "male") multiplier += 0.03;

    multiplier = Math.max(1.1, Math.min(multiplier, 1.9));

    // -------------------------------
    // 6. DAILY BURN (baseline)
    // -------------------------------
    let dailyBurn = bmr * multiplier;

    // Realistic daily burn limits:
    const maxDaily = profile.gender === "female" ? 2800 : 3500; // max human female/male
    const minDaily = 1200; // minimum metabolism for human adult

    dailyBurn = Math.max(minDaily, Math.min(dailyBurn, maxDaily));

    const baseWeeklyBurn = dailyBurn * 7;

    // -------------------------------
    // 7. PREP WORKOUTS FOR AI
    // -------------------------------
    const workoutText =
      workouts.length > 0
        ? workouts
            .map(
              (w, i) =>
                `${i + 1}. ${w.name} (${w.category}) — ${
                  Math.round(
                    (new Date(w.completedAt) - new Date(w.startedAt)) / 60000
                  ) || "N/A"
                } mins\n` +
                w.exercises
                  .map(
                    (e) =>
                      `   • ${e.name}: ${e.sets}×${e.reps} @ ${e.weight || 0}kg`
                  )
                  .join("\n")
            )
            .join("\n\n")
        : "No workouts logged.";

    // -------------------------------
    // 8. AI Workout-Only Calories
    // -------------------------------
    const prompt = `
You are a certified fitness coach.

Estimate ONLY the calories burned FROM THESE WORKOUTS BELOW.
Do NOT include BMR or daily activity.

User:
- Gender: ${profile.gender}
- Weight: ${profile.weight} kg
- Age: ${profile.age}
- Height: ${profile.height} cm

Workouts:
${workoutText}

RULES:
- Strength (45–60 min): 150–300 kcal
- HIIT (20–30 min): 250–450 kcal
- Walking (45 min): 180–280 kcal
- Adjust based on weight + gender

Return ONLY a single integer, e.g. 920
`.trim();

    let workoutBurn = 0;

    if (workouts.length > 0) {
      try {
        const aiOutput = await callGemini(prompt, userId);
        workoutBurn = parseInt(aiOutput.trim(), 10);

        // sanity check
        const maxWorkout = 6000; // extreme upper bound
        const minWorkout = 150; // at least something

        if (
          isNaN(workoutBurn) ||
          workoutBurn < minWorkout ||
          workoutBurn > maxWorkout
        ) {
          workoutBurn = workouts.length * 220; // fallback realistic
        }
      } catch {
        workoutBurn = workouts.length * 220;
      }
    }

    // -------------------------------
    // 9. TOTAL WEEKLY BURN
    // -------------------------------
    let estimatedBurn = baseWeeklyBurn + workoutBurn;

    // Final realistic boundaries
    const minWeek = 8000; // minimum alive adult
    const maxWeek = profile.gender === "female" ? 15000 : 17000; // sex-specific upper cap

    estimatedBurn = Math.max(minWeek, Math.min(estimatedBurn, maxWeek));

    // -------------------------------
    // 10. Net Calories & Label
    // -------------------------------
    const netCalories = totalIntake - estimatedBurn;

    let message = "";
    if (netCalories > 500)
      message = `You're in a calorie surplus (+${netCalories} kcal). Good for muscle gain!`;
    else if (netCalories < -500)
      message = `Strong deficit (${netCalories} kcal). Great for fat loss — keep it up!`;
    else message = "You're close to maintenance — ideal for recomposition.";

    // -------------------------------
    // 11. Response
    // -------------------------------
    res.json({
      weekStart: weekStart.toISOString().split("T")[0],
      totalIntake,
      estimatedBurn: Math.round(estimatedBurn),
      netCalories,
      balance:
        netCalories > 0
          ? "Surplus"
          : netCalories < -500
          ? "Aggressive Deficit"
          : "Deficit",
      message,
      workoutCount: workouts.length,
      mealCount: nutritions.length,
      userProfile: {
        weight: profile.weight,
        gender: profile.gender,
        goal: profile.goal,
      },
    });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI analysis temporarily unavailable" });
  }
};

// 1. Nutrition Autofill
export const queryNutrition = async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ message: "Enter at least 2 characters" });
  }

  const prompt = `
  Analyze food: "${query.trim()}"
  Return ONLY valid JSON with integers:
  {
    "calories": 600,
    "protein": 50,
    "carbs": 70,
    "fat": 20
  }
  `;

  try {
    const jsonText = await callGemini(prompt);
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "AI lookup failed. Try again." });
  }
};

// 2. Smart Progress Coach
export const getProgressAdvice = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId })
      .sort({ date: -1 })
      .limit(12);

    if (workouts.length === 0) {
      return res.json({ advice: "Start logging workouts to get AI tips!" });
    }

    const benchExercises = workouts
      .flatMap((w) => w.exercises.map((e) => ({ ...e, date: w.date })))
      .filter((e) => e.name.toLowerCase().includes("bench"))
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    let advice = "Keep training consistently!";

    if (benchExercises.length >= 3) {
      const weights = benchExercises.map((e) => e.weight).filter(Boolean);
      const isStuck =
        weights.length >= 3 &&
        weights.slice(0, 3).every((w) => w === weights[0]);

      if (isStuck) {
        const prompt = `User stuck at ${weights[0]}kg bench press for ${weights.length} sessions. Give 1 short, actionable tip to break plateau.`;
        advice = await callGemini(prompt);
      } else if (weights[0] > weights[weights.length - 1]) {
        advice = "Great progress on bench! Keep pushing.";
      }
    }

    res.json({ advice });
  } catch (err) {
    res.json({ advice: "Stay consistent and recover well." });
  }
};

// 3. AI CALORIE BURN TRACKER (7 DAYS)
// export const getCalorieBurnAnalysis = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const [nutritions, workouts] = await Promise.all([
//       Nutrition.find({
//         user: userId,
//         date: { $gte: sevenDaysAgo },
//       }),
//       Workout.find({
//         user: userId,
//         date: { $gte: sevenDaysAgo },
//         status: "completed",
//       }).sort({ date: -1 }),
//     ]);

//     const totalIntake = nutritions.reduce((sum, n) => sum + n.totalCalories, 0);

//     const workoutText = workouts.length > 0
//       ? workouts
//           .map((w, i) => `${i + 1}. ${w.name} (${w.category})\n` +
//             w.exercises
//               .map(e => `   • ${e.name}: ${e.sets}×${e.reps} @ ${e.weight || 0}kg`)
//               .join("\n")
//           )
//           .join("\n\n")
//       : "No completed workouts.";

//     const prompt = `
//       You are a certified fitness AI. Estimate total calories burned from these 7-day workouts:

//       ${workoutText}

//       User: 70kg male, moderate intensity, average effort.
//       Return ONLY a number (total calories burned in 7 days).
//       Example: 12450
//     `;

//     const aiResponse = await callGemini(prompt);
//     const estimatedBurn = parseInt(aiResponse) || 0;

//     const netCalories = totalIntake - estimatedBurn;

//     res.json({
//       weekStart: sevenDaysAgo.toISOString().split("T")[0],
//       totalIntake,
//       estimatedBurn,
//       netCalories,
//       message: netCalories > 0 ? "Calorie Surplus" : "Calorie Deficit",
//       workoutCount: workouts.length,
//       mealCount: nutritions.length,
//     });
//   } catch (error) {
//     console.error("AI Calorie Burn Error:", error);
//     res.status(500).json({ error: "AI analysis failed. Try again." });
//   }
// };
