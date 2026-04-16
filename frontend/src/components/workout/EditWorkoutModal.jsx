// src/components/modals/EditWorkoutModal.jsx
import { useState, useEffect } from "react";
import useWorkouts from "../../hooks/useWorkouts";
import { Plus, X } from "lucide-react";

export default function EditWorkoutModal({
  workout: initialWorkout,
  onClose,
  onSave,
}) {
  const { updateWorkout } = useWorkouts();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("strength");
  const [date, setDate] = useState("");
  const [exercises, setExercises] = useState([]);
  useEffect(() => {
    if (initialWorkout) {
      setName(initialWorkout.name || "");
      setCategory(initialWorkout.category || "strength");

      if (initialWorkout.date) {
        const dt = new Date(initialWorkout.date);
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDate(local);
      } else {
        setDate("");
      }

      setExercises(
        initialWorkout.exercises?.length
          ? initialWorkout.exercises.map((e) => ({ ...e }))
          : [{ name: "", sets: "", reps: "", weight: "" }]
      );
    }
  }, [initialWorkout]);

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const removeExercise = (i) => {
    setExercises(exercises.filter((_, idx) => idx !== i));
  };

  const updateExercise = (i, field, value) => {
    const updated = [...exercises];
    updated[i][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      date,
      exercises: exercises
        .filter((e) => e.name)
        .map((e) => ({
          name: e.name,
          sets: Number(e.sets),
          reps: Number(e.reps),
          weight: Number(e.weight) || 0,
        })),
    };

    try {
      await updateWorkout(initialWorkout._id, payload);
      onSave?.();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  if (!initialWorkout) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-highlight">
            Edit Workout
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-surface-hover rounded hover:opacity-80 transition"
          >
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Workout Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-surface-input text-text-base rounded border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-surface-input text-text-base rounded border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="other">Other</option>
          </select>

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-surface-input text-text-base rounded border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-text-label">
                Exercises
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="text-xs text-brand-primary flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {exercises.map((ex, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
              >
                <input
                  placeholder="Exercise"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, "sets", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="kg"
                  value={ex.weight}
                  onChange={(e) => updateExercise(i, "weight", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                />
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(i)}
                    className="p-2 bg-error text-white rounded text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-button-primary text-text-inverted rounded-lg font-bold hover:opacity-90 transition"
            >
              Update Workout
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-surface-hover text-text-base rounded-lg hover:opacity-80 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
