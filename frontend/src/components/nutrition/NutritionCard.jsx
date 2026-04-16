// frontend/src/components/nutrition/NutritionCard.jsx
import { useState } from "react";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import NutritionForm from "./NutritionForm";
import useNutrition from "../../hooks/useNutritions";

export default function NutritionCard({ nutrition, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteNutrition } = useNutrition();

const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Delete Meal?",
    text: "This meal will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteNutrition(nutrition._id);

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Meal deleted successfully.",
      timer: 1400,
      showConfirmButton: false,
    });

    onUpdate();
  } catch (err) {
    Swal.fire(
      "Error",
      err?.response?.data?.message || "Delete failed",
      "error"
    );
  }
};


  if (isEditing) {
    return (
      <NutritionForm
        initialData={nutrition}
        onClose={() => setIsEditing(false)}
        onSave={() => {
          onUpdate();
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="bg-surface-card p-5 rounded-xl border border-border-card hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-text-base capitalize text-lg">
            {nutrition.mealType}
          </h4>
          <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
            <Calendar size={12} /> {new Date(nutrition.date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-1">
          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 bg-brand-accent rounded hover:opacity-80 transition"
            title="Edit Meal"
          >
            <Edit2 size={16} className="text-text-inverted" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-1.5 bg-error rounded hover:opacity-80 transition"
            title="Delete Meal"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Foods List */}
      <div className="space-y-1.5 text-sm">
        {nutrition.foods.map((f, i) => (
          <div key={i} className="flex justify-between items-center py-1 px-2 bg-surface-card-alt rounded">
            <span className="text-text-base font-medium">{f.name}</span>
            <span className="text-text-muted text-xs">
              {f.quantity}{f.unit} — {f.calories}kcal
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-border-card flex justify-between items-center">
        <div className="text-left">
          <p className="text-text-highlight font-bold text-xl">
            {nutrition.totalCalories} kcal
          </p>
          <p className="text-xs text-text-muted">Total Calories</p>
        </div>

        <div className="flex gap-4 text-sm text-text-muted">
          <div className="text-center">
            <p className="font-bold text-success">{nutrition.totalProtein}g</p>
            <p className="text-xs">Protein</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-brand-primary">{nutrition.totalCarbs}g</p>
            <p className="text-xs">Carbs</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-warning">{nutrition.totalFats}g</p>
            <p className="text-xs">Fats</p>
          </div>
        </div>
      </div>
    </div>
  );
}