// components/register/Step1Account.jsx
import { useFormContext } from "react-hook-form";

export default function Step1Account() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-brand-secondary">Account Setup</h2>
      <div className="space-y-4">
        <div>
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base placeholder-text-muted focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
          {errors.username && (
            <p className="text-error text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base placeholder-text-muted focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-md bg-surface-card border border-border-card text-text-base placeholder-text-muted focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}