// frontend/src/pages/user/NutritionPage.jsx
import { useState, useEffect } from "react";
import useNutrition from "../../../hooks/useNutritions";
import NutritionForm from "../../../components/nutrition/NutritionForm";
import NutritionCard from "../../../components/nutrition/NutritionCard";
import { Plus, Calendar, Download, Search, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import useAuth from "../../../hooks/useAuth";

export default function NutritionPage() {
  const { nutritions, loading, fetchNutritions } = useNutrition();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("all");

  const getPKTToday = () => {
    const now = toZonedTime(new Date(), "Asia/Karachi");
    return format(now, "yyyy-MM-dd");
  };

  const [selectedDate, setSelectedDate] = useState(getPKTToday());

  useEffect(() => {
    fetchNutritions(selectedDate);
  }, [selectedDate]);

  const filteredMeals = nutritions.filter((n) => {
    const mealPKT = toZonedTime(new Date(n.date), "Asia/Karachi");
    const matchesDate = format(mealPKT, "yyyy-MM-dd") === selectedDate;
    const matchesMeal = mealFilter === "all" || n.mealType === mealFilter;
    const matchesSearch =
      searchQuery === "" ||
      n.foods.some((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      n.mealType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesMeal && matchesSearch;
  });

  const dailyTotal = filteredMeals.reduce(
    (acc, n) => ({
      calories: acc.calories + (n.totalCalories || 0),
      protein: acc.protein + (n.totalProtein || 0),
      carbs: acc.carbs + (n.totalCarbs || 0),
      fats: acc.fats + (n.totalFats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const clearFilters = () => {
    setSearchQuery("");
    setMealFilter("all");
  };

  const truncate = (str, n) =>
    str.length > n ? str.substr(0, n - 1) + "..." : str;

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Helper: CSS var → Hex
      const getColor = (varName) => {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim();
        if (!value) return "#000000";
        if (value.startsWith("#")) return value;
        if (value.startsWith("rgb")) {
          const rgb = value.match(/\d+/g).map(Number);
          return "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");
        }
        return "#000000";
      };

      const colors = {
        brandPrimary: getColor("--color-brand-primary"),
        surfaceCard: getColor("--color-surface-card"),
        surfaceCardAlt: getColor("--color-surface-card-alt"),
        surfaceHover: getColor("--color-surface-hover"),
        textBase: getColor("--color-text-base"),
        textMuted: getColor("--color-text-muted"),
        success: getColor("--color-success"),
        warning: getColor("--color-warning"),
        error: getColor("--color-error"),
      };

      let y = 50;
      const lineHeight = 5;
      const maxWidthFoods = 45;
      const maxWidthQty = 30;

      // === HEADER ===
      doc.setFillColor(colors.brandPrimary);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("FITNESS TRACKER", 14, 22);
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Daily Nutrition Report", 14, 32);

      doc.setTextColor(colors.textBase);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Date: ${format(
          toZonedTime(selectedDate, "Asia/Karachi"),
          "dd MMM yyyy"
        )}`,
        140,
        20
      );
      doc.text(`User: ${user?.username || "Fitness User"}`, 140, 28);

      // === TABLE HEADER ===
      doc.setFillColor(0, 0, 0);
      doc.rect(14, y, 182, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Meal", 18, y + 7);
      doc.text("Foods", 50, y + 7);
      doc.text("Qty", 100, y + 7);
      doc.text("Calories", 130, y + 7);
      doc.text("P/C/F", 160, y + 7);
      y += 12;

      doc.setTextColor(colors.textBase);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // === MEAL ROWS ===
      ["breakfast", "lunch", "dinner", "snack"].forEach((type) => {
        const meals = filteredMeals.filter((n) => n.mealType === type);
        if (!meals.length) return;

        // Meal Type Header
        doc.setFont("helvetica", "bold");
        doc.setFillColor(colors.brandPrimary);
        doc.rect(14, y - 2, 182, 8, "F");
        doc.setTextColor(0, 0, 0);
        doc.text(type.toUpperCase(), 18, y + 4);
        y += 10;

        // Meal Items
        doc.setFont("helvetica", "normal");
        meals.forEach((meal) => {
          const foodList = meal.foods.map((f) => f.name).join(", ");
          const qty = meal.foods
            .map((f) => `${f.quantity}${f.unit}`)
            .join(" + ");
          const macros = `${meal.totalProtein}P/${meal.totalCarbs}C/${meal.totalFats}F`;

          // Split long text
          const foodLines = doc.splitTextToSize(foodList, maxWidthFoods);
          const qtyLines = doc.splitTextToSize(qty, maxWidthQty);
          const maxLines = Math.max(foodLines.length, qtyLines.length, 1);

          // Row background (tall enough for all lines)
          doc.setFillColor(colors.surfaceCardAlt);
          doc.rect(14, y - 2, 182, maxLines * lineHeight + 4, "F");

          doc.setTextColor(colors.textBase);

          // Meal Type
          doc.text(type.charAt(0).toUpperCase() + type.slice(1), 18, y + 4);

          // Foods (multi-line)
          foodLines.forEach((line, i) => {
            doc.text(line, 50, y + 4 + i * lineHeight);
          });

          // Qty (multi-line)
          qtyLines.forEach((line, i) => {
            doc.text(line, 100, y + 4 + i * lineHeight);
          });

          // Calories & Macros (single line)
          doc.text(`${meal.totalCalories}`, 135, y + 4);
          doc.text(macros, 160, y + 4);

          // Move y down
          y += maxLines * lineHeight + 4;
        });
        y += 5;
      });

      // === DAILY TOTAL ===

      // Background (full-width bar)
      doc.setFillColor(colors.brandPrimary); // or (0,0,0) for black
      doc.rect(14, y, 182, 19, "F");

      // Text styling
      doc.setTextColor(0, 0, 0); // or white for dark mode
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      // Vertical centering
      const textY = y + 9;

      // LEFT: Title
      doc.text("DAILY TOTAL", 18, textY);

      // RIGHT: Calories (right aligned)
      doc.text(
        `${dailyTotal.calories} kcal`,
        190, // X position (right edge)
        textY,
        { align: "right" }
      );

      // RIGHT: Macros below calories
      doc.setFontSize(10);
      doc.text(
        `${dailyTotal.protein}P  |  ${dailyTotal.carbs}C  |  ${dailyTotal.fats}F`,
        190,
        textY + 6, // Slightly below calories
        { align: "right" }
      );

      // Update y for next section
      // y += 18;

      y += 20;

      // === FOOTER ===
      doc.setFontSize(10);
      doc.setTextColor(colors.textMuted);
      doc.text("Generated by Fitness Tracker App", 14, 285);
      doc.text("Page 1 of 1", 170, 285);

      // Save
      doc.save(`nutrition-report-${format(selectedDate, "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error("PDF Export Failed:", error);
      alert("Failed to export PDF. Check console (F12).");
    }
  };

  return (
    <div className="mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-text-highlight">Nutrition</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-button-primary text-text-inverted rounded-lg hover:opacity-90 transition"
          >
            <Plus size={18} /> Add Meal
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:opacity-90 transition"
          >
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-card p-4 rounded-xl border border-border-card space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-3 text-text-muted"
              size={20}
            />
            <input
              type="text"
              placeholder="Search food or meal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-input text-text-base rounded-lg border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <select
            value={mealFilter}
            onChange={(e) => setMealFilter(e.target.value)}
            className="px-4 py-2 bg-surface-input text-text-base rounded-lg border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>

          <div className="relative">
            <Calendar
              className="absolute left-3 top-3 text-text-muted"
              size={20}
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface-input text-text-base rounded-lg border border-border-input focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {(searchQuery || mealFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition"
            >
              <XCircle size={18} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Calories", value: dailyTotal.calories, unit: "kcal" },
          { label: "Protein", value: dailyTotal.protein, unit: "g" },
          { label: "Carbs", value: dailyTotal.carbs, unit: "g" },
          { label: "Fats", value: dailyTotal.fats, unit: "g" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-card p-4 rounded-xl border border-border-card text-center shadow-md"
          >
            <p className="text-2xl font-bold text-text-highlight">
              {stat.value}
            </p>
            <p className="text-sm text-text-muted">
              {stat.label} ({stat.unit})
            </p>
          </div>
        ))}
      </div>

      {/* Meals List */}
      <div className="space-y-8">
        {loading ? (
          <p className="text-center text-text-muted">Loading...</p>
        ) : filteredMeals.length === 0 ? (
          <p className="text-center text-text-muted">No meals found</p>
        ) : (
          ["breakfast", "lunch", "dinner", "snack"].map((type) => {
            const meals = filteredMeals.filter((n) => n.mealType === type);
            if (!meals.length) return null;
            return (
              <div key={type}>
                <h2 className="text-xl font-semibold text-text-highlight capitalize mb-3">
                  {type}
                </h2>
                <div className="space-y-3">
                  {meals.map((n) => (
                    <NutritionCard
                      key={n._id}
                      nutrition={n}
                      onUpdate={() => fetchNutritions(selectedDate)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form */}
      {showForm && (
        <NutritionForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            fetchNutritions(selectedDate);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
