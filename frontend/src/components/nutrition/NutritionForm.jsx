// frontend/src/components/nutrition/NutritionForm.jsx
import { useState } from "react";
import { X, Plus } from "lucide-react";
import useNutrition from "../../hooks/useNutritions";

export default function NutritionForm({ initialData, onClose, onSave }) {
  const { createNutrition, updateNutrition } = useNutrition();
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    mealType: initialData?.mealType || "breakfast",
    foods: initialData?.foods.length
      ? initialData.foods.map((f) => ({
          name: f.name,
          quantity: f.quantity,
          unit: f.unit,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fats: f.fats,
        }))
      : [
          {
            name: "",
            quantity: "",
            unit: "g",
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
          },
        ],
  });

  const addFood = () => {
    setForm({
      ...form,
      foods: [
        ...form.foods,
        {
          name: "",
          quantity: "",
          unit: "g",
          calories: "",
          protein: "",
          carbs: "",
          fats: "",
        },
      ],
    });
  };

  const removeFood = (i) => {
    setForm({ ...form, foods: form.foods.filter((_, idx) => idx !== i) });
  };

  const updateFood = (i, field, val) => {
    const updated = [...form.foods];
    updated[i][field] = val;
    setForm({ ...form, foods: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      mealType: form.mealType,
      foods: form.foods
        .filter((f) => f.name && f.calories)
        .map((f) => ({
          name: f.name,
          quantity: Number(f.quantity) || 1,
          unit: f.unit,
          calories: Number(f.calories),
          protein: Number(f.protein) || 0,
          carbs: Number(f.carbs) || 0,
          fats: Number(f.fats) || 0,
        })),
    };

    try {
      if (isEdit) {
        await updateNutrition(initialData._id, payload);
      } else {
        await createNutrition(payload);
      }
      onSave();
    } catch (err) {
      // Toast in hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-card p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-highlight">
            {isEdit ? "Edit Meal" : "Add New Meal"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-surface-hover rounded hover:opacity-80 transition"
          >
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Meal Type */}
          <div>
            <label className="block text-sm font-medium text-text-label mb-1">
              Meal Type
            </label>
            <select
              value={form.mealType}
              onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              className="w-full px-3 py-2 bg-surface-input text-text-base rounded border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Foods */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-text-label">
                Foods
              </label>
              <button
                type="button"
                onClick={addFood}
                className="text-xs flex items-center gap-1 text-brand-primary hover:text-brand-accent"
              >
                <Plus size={14} /> Add Food
              </button>
            </div>

            {form.foods.map((food, i) => (
              <div
                key={i}
                className="relative grid grid-cols-1 md:grid-cols-8 gap-2 items-center bg-surface-input/40 p-2 rounded-md"
              >
                {/* Name */}
                <input
                  placeholder="Food Name"
                  value={food.name}
                  onChange={(e) => updateFood(i, "name", e.target.value)}
                  className="md:col-span-2 p-2 bg-surface-input text-text-base rounded border border-border-input text-sm focus:ring-1 focus:ring-brand-primary"
                  required
                />

                {/* Quantity */}
                <input
                  type="number"
                  placeholder="Qty"
                  value={food.quantity}
                  onChange={(e) => updateFood(i, "quantity", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm focus:ring-1 focus:ring-brand-primary"
                  required
                />

                {/* Unit */}
                <select
                  value={food.unit}
                  onChange={(e) => updateFood(i, "unit", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="cup">cup</option>
                  <option value="piece">piece</option>
                </select>

                {/* Calories */}
                <input
                  type="number"
                  placeholder="Cal"
                  value={food.calories}
                  onChange={(e) => updateFood(i, "calories", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm focus:ring-1 focus:ring-brand-primary"
                  required
                />

                {/* P, C, F */}
                <input
                  type="number"
                  placeholder="P"
                  value={food.protein}
                  onChange={(e) => updateFood(i, "protein", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                />
                <input
                  type="number"
                  placeholder="C"
                  value={food.carbs}
                  onChange={(e) => updateFood(i, "carbs", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                />
                <input
                  type="number"
                  placeholder="F"
                  value={food.fats}
                  onChange={(e) => updateFood(i, "fats", e.target.value)}
                  className="p-2 bg-surface-input text-text-base rounded border border-border-input text-sm"
                />

                {/* Remove button (aligned to top-right) */}
                {form.foods.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFood(i)}
                    className="absolute -top-2 -right-2 p-1.5 bg-error/90 text-white rounded-full hover:bg-error transition shadow-sm"
                    title="Remove food"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-button-primary text-text-inverted rounded-lg font-bold hover:opacity-90 transition"
            >
              {isEdit ? "Update Meal" : "Save Meal"}
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
