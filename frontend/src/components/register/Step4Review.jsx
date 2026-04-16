// components/register/Step4Review.jsx
import { useFormContext } from "react-hook-form";

export default function Step4Review() {
  const { getValues } = useFormContext();
  const data = getValues();

  const displayMap = {
    username: "Username",
    email: "Email",
    gender: "Gender",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    fitnessGoal: "Fitness Goal",
    activityLevel: "Activity Level",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-brand-primary">
        Review & Confirm
      </h2>
      <div className="space-y-2 bg-surface-card p-4 rounded-md border border-border-card">
        {Object.entries(displayMap).map(([key, label]) => (
          <p key={key} className="text-text-base">
            <span className="font-semibold capitalize">{label}:</span>{" "}
            <span className="text-text-muted">{data[key] || "—"}</span>
          </p>
        ))}
      </div>
    </div>
  );
}