// frontend/src/pages/user/AnalyticsPage.jsx → FINAL + THEME 100% MATCHED

import { useEffect, useMemo } from "react";
import useWorkout from "../../hooks/useWorkouts";
import useNutrition from "../../hooks/useNutritions";
import useProgress from "../../hooks/useProgress";
import { format, subDays, eachDayOfInterval } from "date-fns";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Tooltip as RechartsTooltip
} from "recharts";
import { Activity, Dumbbell, Flame } from "lucide-react";

export default function AnalyticsPage() {
  const { workouts, fetchWorkouts } = useWorkout();
  const { nutritions, fetchNutritions } = useNutrition();
  const { progress } = useProgress();

  useEffect(() => {
    fetchWorkouts();
    fetchNutritions();
  }, []);

  const last7Days = useMemo(() => {
    return eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });
  }, []);

  const weeklyFrequency = useMemo(() => {
    return last7Days.map((day) => {
      const dayKey = format(day, "yyyy-MM-dd");
      const count = workouts.filter((w) => format(new Date(w.date), "yyyy-MM-dd") === dayKey).length;
      return { day: format(day, "EEE"), workouts: count };
    });
  }, [workouts]);

  const macroDistribution = useMemo(() => {
    const total = nutritions.reduce((acc, n) => ({
      protein: acc.protein + (n.totalProtein || 0),
      carbs: acc.carbs + (n.totalCarbs || 0),
      fats: acc.fats + (n.totalFats || 0),
    }), { protein: 0, carbs: 0, fats: 0 });

    const sum = total.protein + total.carbs + total.fats;
    if (sum === 0) return [];

    return [
      { name: "Protein", value: Math.round((total.protein / sum) * 100), color: "var(--color-success)" },
      { name: "Carbs",   value: Math.round((total.carbs / sum) * 100),   color: "var(--color-warning)" },
      { name: "Fats",    value: Math.round((total.fats / sum) * 100),    color: "var(--color-text-base)" },
    ];
  }, [nutritions]);

  const weightProgress = useMemo(() => {
    return progress
      .filter((p) => p.weight)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((p) => ({
        date: format(new Date(p.date), "MMM dd"),
        weight: p.weight,
      }));
  }, [progress]);

  return (
    <div className="mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-text-highlight flex items-center gap-3">
        Your Analytics
      </h1>

      {/* Weekly Workout Frequency */}
      <div className="bg-surface-card p-8 rounded-2xl border border-border-card shadow-lg">
        <h2 className="text-2xl font-bold text-text-base mb-6 flex items-center gap-3">
          <Dumbbell size={28} className="text-warning" />
          Weekly Workout Frequency
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyFrequency}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border-card)" />
            <XAxis dataKey="day" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: "var(--color-surface-card-alt)", 
                border: "1px solid var(--color-border-card)", 
                borderRadius: "12px" 
              }}
              labelStyle={{ color: "var(--color-text-base)" }}
            />
            <Bar dataKey="workouts" fill="var(--color-warning)" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Macro Distribution */}
      <div className="bg-surface-card p-8 rounded-2xl border border-border-card shadow-lg">
        <h2 className="text-2xl font-bold text-text-base mb-6 flex items-center gap-3">
          <Flame size={28} className="text-danger" />
          Macro Breakdown
        </h2>
        {macroDistribution.length === 0 ? (
          <div className="text-center py-20 text-text-muted text-lg">
            No nutrition data yet. Log your first meal!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={macroDistribution}
                cx="50%" cy="50%"
                innerRadius={90} outerRadius={140}
                paddingAngle={6}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelStyle={{ fill: "var(--color-text-base)", fontWeight: "bold", fontSize: 14 }}
              >
                {macroDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: "var(--color-surface-card-alt)", 
                  border: "1px solid var(--color-border-card)", 
                  borderRadius: "12px" 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Weight Progress */}
      {weightProgress.length > 0 && (
        <div className="bg-surface-card p-8 rounded-2xl border border-border-card shadow-lg">
          <h2 className="text-2xl font-bold text-text-base mb-6">
            Weight Progress
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightProgress}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border-card)" />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: "var(--color-surface-card-alt)", 
                  border: "1px solid var(--color-border-card)", 
                  borderRadius: "12px" 
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-brand-primary)"
                strokeWidth={4}
                dot={{ fill: "var(--color-brand-primary)", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}