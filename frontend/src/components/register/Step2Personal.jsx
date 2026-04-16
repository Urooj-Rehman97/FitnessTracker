// components/register/Step2Personal.jsx
import { useFormContext } from "react-hook-form";

export default function Step2Personal() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-brand-primary">Personal Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <select
            {...register("gender")}
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-error text-sm mt-1">{errors.gender.message}</p>}
        </div>

        <div>
          <input
            {...register("age", { valueAsNumber: true })}
            type="number"
            placeholder="Age"
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base placeholder-text-muted focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
          {errors.age && <p className="text-error text-sm mt-1">{errors.age.message}</p>}
        </div>

        <div>
          <input
            {...register("height", { valueAsNumber: true })}
            type="number"
            placeholder="Height (cm)"
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base placeholder-text-muted focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
          {errors.height && <p className="text-error text-sm mt-1">{errors.height.message}</p>}
        </div>

        <div>
          <input
            {...register("weight", { valueAsNumber: true })}
            type="number"
            placeholder="Weight (kg)"
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base placeholder-text-muted focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
          {errors.weight && <p className="text-error text-sm mt-1">{errors.weight.message}</p>}
        </div>
      </div>
    </div>
  );
}