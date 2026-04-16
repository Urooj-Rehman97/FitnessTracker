// src/pages/user/ProgressPage.jsx
import { useState } from "react";
import useProgress from "../../../hooks/useProgress";
import ProgressForm from "../../../components/progress/ProgressForm";
import ProgressChart from "../../../components/progress/ProgressChart";
import { Plus, TrendingUp, Activity } from "lucide-react";

export default function ProgressPage() {
  const { progress, latest, trend, loading, fetchProgress } = useProgress();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent"></div>
        <p className="text-2xl font-bold text-text-muted">Loading Progress...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page p-6 md:p-8">
      <div className="mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-brand-primary flex items-center gap-4">
            Progress
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-4 bg-brand-primary text-black rounded-2xl font-bold text-lg hover:bg-brand-secondary transition-all hover:scale-105 shadow-xl"
          >
            <Plus size={24} />
            Log Progress
          </button>
        </div>

        {/* Trend Alert */}
        {trend && (
          <div className={`p-6 rounded-2xl text-center font-bold text-lg border-2 ${
            trend.type === "positive"
              ? "bg-success/10 border-success text-success"
              : trend.type === "negative"
              ? "bg-error/10 border-error text-error"
              : "bg-warning/10 border-warning text-warning"
          }`}>
            <div className="flex items-center justify-center gap-3">
              <Activity size={28} />
              <span>{trend.message}</span>
            </div>
          </div>
        )}

        {/* Latest Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Weight", value: latest.weight, unit: "kg" },
            { label: "Body Fat", value: latest.bodyFat, unit: "%" },
            { label: "Waist", value: latest.waist, unit: "cm" },
            { label: "Arms", value: latest.arms, unit: "cm" },
            { label: "Chest", value: latest.chest, unit: "cm" },
            { label: "Hips", value: latest.hips, unit: "cm" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-card border border-border-card rounded-2xl p-6 text-center shadow-xl hover:scale-105 transition-transform"
            >
              <p className="text-4xl font-black text-brand-primary">
                {stat.value ?? "-"}
              </p>
              <p className="text-lg text-text-muted mt-2">
                {stat.label} <span className="text-text-label">{stat.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="bg-surface-card border border-border-card rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-text-base mb-8 text-center">
            Body Evolution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProgressChart
              data={progress}
              field="weight"
              label="Weight (kg)"
              color="#d4af37"
            />
            <ProgressChart
              data={progress}
              field="bodyFat"
              label="Body Fat (%)"
              color="#ef4444"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <ProgressForm
            onClose={() => setShowForm(false)}
            onSave={async () => {
              await fetchProgress();
              setShowForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}