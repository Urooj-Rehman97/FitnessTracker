// frontend/src/pages/user/Dashboard.jsx
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useWorkout from "../../hooks/useWorkouts";
import useNutrition from "../../hooks/useNutritions";
import useProgress from "../../hooks/useProgress";
import axiosInstance from "../../utils/axiosInstance";
import { format } from "date-fns";
import {
  Activity,
  Flame,
  TrendingUp,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Clock,
  MapPin,
} from "lucide-react";
import ProgressChart from "../../components/progress/ProgressChart";
import {
  getCachedAIData,
  setCachedAIData,
  clearAIDataCache,
} from "../../utils/cache/aiCache";

export default function Dashboard() {
  const { user } = useAuth();
  const { workouts, fetchWorkouts } = useWorkout();
  const { nutritions, fetchNutritions } = useNutrition();
  const { progress, latest, fetchProgress } = useProgress();

  const [today] = useState(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  });

  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWorkouts();
    fetchNutritions(today);
    fetchProgress();
  }, [today]);

  // FETCH AI DATA — CACHE FIRST
  useEffect(() => {
    const fetchAIData = async () => {
      setAiLoading(true);
      const cached = getCachedAIData();
      if (cached) {
        console.log("AI: Using 24h cached data");
        setAiData(cached);
        setAiLoading(false);
        return;
      }

      try {
        console.log("AI: Fetching from backend");
        const res = await axiosInstance.get("/api/ai/calorie-burn");
        setAiData(res.data);
        setCachedAIData(res.data);
      } catch (err) {
        setAiData({
          totalIntake: 0,
          estimatedBurn: 0,
          netCalories: 0,
          message: "AI unavailable",
          workoutCount: 0,
          mealCount: 0,
        });
      } finally {
        setAiLoading(false);
      }
    };
    fetchAIData();
  }, []);

  const handleRefreshAI = async () => {
    setRefreshing(true);
    clearAIDataCache();
    try {
      const res = await axiosInstance.get("/api/ai/calorie-burn");
      setAiData(res.data);
      setCachedAIData(res.data);
    } catch {
      setAiData({
        totalIntake: 0,
        estimatedBurn: 0,
        netCalories: 0,
        message: "AI unavailable",
        workoutCount: 0,
        mealCount: 0,
      });
    } finally {
      setRefreshing(false);
    }
  };

  // BMI
  const calculateBMI = () => {
    if (!latest.weight || !user.height) return null;
    const heightInM = user.height / 100;
    const bmi = (latest.weight / (heightInM * heightInM)).toFixed(1);
    return parseFloat(bmi);
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi
    ? bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obese"
    : "N/A";

  const bmiColor =
    bmiCategory === "Normal"
      ? "text-success"
      : bmiCategory === "Underweight"
      ? "text-blue-400"
      : bmiCategory === "Overweight"
      ? "text-warning"
      : "text-error";

  const todayNutrition = nutritions.filter(
    (n) => format(new Date(n.date), "yyyy-MM-dd") === today
  );
  const dailyTotal = todayNutrition.reduce(
    (acc, n) => ({
      calories: acc.calories + n.totalCalories,
      protein: acc.protein + n.totalProtein,
      carbs: acc.carbs + n.totalCarbs,
      fats: acc.fats + n.totalFats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const recentWorkouts = workouts.slice(0, 3);
  const recentMeals = todayNutrition.slice(0, 3);

  return (
    <div className="mx-auto p-4 space-y-6">
      {/* USER INFO CARD */}
      {/* Welcome */}
      <div className="bg-linear-to-r from-brand-primary to-brand-tertiary p-6 rounded-xl text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
        <p className="text-lg mt-1 opacity-90">
          Here's your fitness journey today
        </p>
      </div>
      {aiLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-surface-card-alt rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : aiData ? (
        <>
          {/* AI 7-Day Summary - FULLY PERSONALIZED */}
          <div className="bg-linear-to-br from-one-uni via-brand-secondary/5 to-brand-primary/30 p-6 rounded-2xl border border-brand-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles
                  size={28}
                  className="text-brand-primary animate-pulse"
                />
                <div>
                  <h3 className="text-2xl font-bold text-text-base">
                    Your 7-Day AI Report
                  </h3>
                  <p className="text-sm text-text-muted">
                    Powered by your real data •{" "}
                    {aiData.userProfile?.gender === "female"
                      ? "Female"
                      : "Male"}
                    , {aiData.userProfile?.weight}kg • Goal:{" "}
                    {aiData.userProfile?.goal}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefreshAI}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-brand-secondary/30 rounded-lg hover:bg-brand-primary/60 transition ease-in-out duration-800"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="text-sm font-medium">Refresh AI</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="bg-surface-card/80 backdrop-blur-sm p-5 rounded-xl border border-border-card text-center hover:scale-105 transition-transform">
                <p className="text-3xl font-bold text-text-base">
                  {aiData.totalIntake.toLocaleString()}
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Calories Consumed
                </p>
              </div>

              <div className="bg-surface-card/80 backdrop-blur-sm p-5 rounded-xl border border-border-card text-center hover:scale-105 transition-transform">
                <p className="text-3xl font-bold text-text-base">
                  {aiData.estimatedBurn.toLocaleString()}
                </p>
                <p className="text-sm text-text-muted mt-1">
                  Calories Burned (Est.)
                </p>
              </div>

              <div
                className={`p-5 rounded-xl text-center backdrop-blur-sm border ${
                  aiData.netCalories > 0
                    ? "bg-green-500/10 border-green-500/30"
                    : aiData.netCalories < -500
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-yellow-500/10 border-yellow-500/30"
                } hover:scale-105 transition-transform`}
              >
                <p
                  className={`text-4xl font-bold ${
                    aiData.netCalories > 0
                      ? "text-text-base"
                      : aiData.netCalories < -500
                      ? "text-text-base"
                      : "text-text-base"
                  }`}
                >
                  {aiData.netCalories > 0 ? "+" : ""}
                  {Math.abs(aiData.netCalories).toLocaleString()}
                </p>
                <p className="text-sm font-medium mt-1">
                  {aiData.balance || "Net"}
                </p>
              </div>
            </div>

            {/* AI Smart Message - PERSONALIZED */}
            <div className="bg-surface-card/60 backdrop-blur-sm rounded-xl p-5 border border-brand-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-primary/20 rounded-full">
                  <Sparkles size={20} className="text-brand-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-base">AI Coach Says:</p>
                  <p className="text-lg mt-1 text-brand-primary font-medium">
                    {aiData.message}
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    Based on {aiData.workoutCount} workouts & {aiData.mealCount}{" "}
                    meals this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-surface-card/50 rounded-xl">
          <Sparkles size={48} className="mx-auto text-brand-primary/30 mb-4" />
          <p className="text-text-muted">
            Log your first workout & meal to unlock AI insights!
          </p>
        </div>
      )}
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-card p-5 rounded-xl flex items-center gap-3 border border-border-card w-full">
          <div className="p-2 bg-error/20 rounded-full">
            <Flame size={20} className="text-error" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-base">
              {dailyTotal.calories}
            </p>
            <p className="text-xs text-text-muted">Today</p>
          </div>
        </div>
        <div className="bg-surface-card p-5 rounded-xl flex items-center gap-3 border border-border-card w-full">
          <div className="p-2 bg-success/20 rounded-full">
            <Activity size={20} className="text-success" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-base">
              {workouts.length}
            </p>
            <p className="text-xs text-text-muted">Workouts</p>
          </div>
        </div>
        <div className="bg-surface-card p-5 rounded-xl flex items-center gap-3 border border-border-card w-full">
          <div className="p-2 bg-success/20 rounded-full">
            <TrendingUp size={20} className="text-success" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-base">
              {latest.weight || "-"} kg
            </p>
            <p className="text-xs text-text-muted">Weight</p>
          </div>
        </div>
        <div className="bg-surface-card p-5 rounded-xl flex items-center gap-3 border border-border-card w-full">
          <div className="p-2 bg-brand-primary/20 rounded-full">
            <User size={20} className="text-brand-primary" />
          </div>
          <div>
            <p className={`text-xl font-bold ${bmiColor}`}>BMI {bmi || "-"}</p>
            <p className="text-xs text-text-muted">{bmiCategory}</p>
          </div>
        </div>
        <div className="bg-surface-card p-5 rounded-xl flex items-center gap-3 border border-border-card w-full">
          <div className="p-2 bg-purple-500/20 rounded-full">
            <Calendar size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-base">
              {progress.length}
            </p>
            <p className="text-xs text-text-muted">Logs</p>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-card p-6 rounded-xl border border-border-card">
          <h2 className="text-lg font-semibold text-text-base mb-4 flex items-center gap-2">
            Recent Workouts
          </h2>
          {recentWorkouts.length === 0 ? (
            <p className="text-center text-text-muted py-8">
              No workouts logged yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((w) => (
                <div key={w._id} className="bg-surface-card-alt p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-text-base">{w.name}</p>
                      <p className="text-xs text-text-muted">
                        {format(new Date(w.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <span className="text-xs bg-brand-primary text-white px-2 py-1 rounded">
                      {w.exercises.length} exercises
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-card p-6 rounded-xl border border-border-card">
          <h2 className="text-lg font-semibold text-text-base mb-4 flex items-center gap-2">
            Today's Meals
          </h2>
          {recentMeals.length === 0 ? (
            <p className="text-center text-text-muted py-8">
              No meals logged today
            </p>
          ) : (
            <div className="space-y-3">
              {recentMeals.map((n) => (
                <div key={n._id} className="bg-surface-card-alt p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-text-base capitalize">
                        {n.mealType}
                      </p>
                      <p className="text-xs text-text-muted">
                        {n.foods
                          .map((f) => `${f.name} ×${f.quantity}${f.unit}`)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-primary">
                        {n.totalCalories} kcal
                      </p>
                      <p className="text-xs text-text-muted">
                        P: {n.totalProtein}g | C: {n.totalCarbs}g | F:{" "}
                        {n.totalFats}g
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Progress Chart */}
      <div className="bg-surface-card p-6 rounded-xl border border-border-card">
        <h2 className="text-lg font-semibold text-text-base mb-4">
          Weight Progress (Last 30 Days)
        </h2>
        {progress.length === 0 ? (
          <p className="text-center text-text-muted py-8">
            No progress data yet
          </p>
        ) : (
          <div className="w-full h-80">
            <ProgressChart data={progress} field="weight" color="#ff8c00" />
          </div>
        )}
      </div>
    </div>
  );
}
