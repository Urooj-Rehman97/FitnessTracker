// components/register/Step3Fitness.jsx
import { useFormContext } from "react-hook-form";

export default function Step3Fitness() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-brand-primary">Fitness Profile</h2>
      <div className="space-y-4">
        <div>
          <select
            {...register("fitnessGoal")}
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Fitness Goal</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="endurance">Endurance</option>
            <option value="general_fitness">General Fitness</option>
          </select>
          {errors.fitnessGoal && (
            <p className="text-error text-sm mt-1">{errors.fitnessGoal.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("activityLevel")}
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Activity Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
            <option value="very_active">Extremely Active</option>
          </select>
          {errors.activityLevel && (
            <p className="text-error text-sm mt-1">{errors.activityLevel.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}