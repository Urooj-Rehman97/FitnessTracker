// src/components/progress/ProgressForm.jsx
import { useState } from "react";
import useProgress from "../../hooks/useProgress";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function ProgressForm({ onClose, onSave }) {
  const { logProgress } = useProgress();
  const [form, setForm] = useState({
    weight: "",
    bodyFat: "",
    waist: "",
    chest: "",
    arms: "",
    hips: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const filled = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== "" && v !== null)
    );

    if (Object.keys(filled).length === 0) {
      toast.error("Please enter at least one field.", { icon: "⚠️" });
      setLoading(false);
      return;
    }

    try {
      await logProgress({ ...filled, date: new Date() });
      toast.success("Progress saved successfully!", { icon: "🔥" });
      onSave?.();
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "weight", label: "Weight (kg)" },
    { key: "bodyFat", label: "Body Fat (%)" },
    { key: "waist", label: "Waist (cm)" },
    { key: "chest", label: "Chest (cm)" },
    { key: "arms", label: "Arms (cm)" },
    { key: "hips", label: "Hips (cm)" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border-card">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-highlight">
            Log Progress
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-surface-hover rounded hover:opacity-80 transition"
          >
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Grid Inputs */}
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ key, label }) => (
              <input
                key={key}
                type="number"
                step="0.1"
                placeholder={label}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="px-3 py-2 bg-surface-input text-text-base rounded border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              />
            ))}
          </div>

          {/* Notes */}
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 bg-surface-input text-text-base rounded border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            rows={3}
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-button-primary text-text-inverted rounded-lg font-bold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Progress"}
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
