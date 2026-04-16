// src/pages/user/WorkoutsList.jsx
import { useState } from "react";
import useWorkouts from "../../hooks/useWorkouts";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddWorkoutModal from "../../components/workout/AddWorkoutModal";
import EditWorkoutModal from "../../components/workout/EditWorkoutModal";
import {
  Edit2,
  Trash2,
  Calendar,
  Dumbbell,
  Play,
  CheckCircle,
  StretchHorizontal,
} from "lucide-react";

const getStatusBadge = (status) => {
  const styles = {
    scheduled: "bg-surface-card-alt text-text-muted",
    upcoming: "bg-brand-secondary text-text-base",
    "in-progress": "bg-brand-accent text-text-base",
    completed: "bg-success text-text-base",
    missed: "bg-error text-text-base",
  };
  const label =
    status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
      {label}
    </span>
  );
};

export default function WorkoutsList() {
  const navigate = useNavigate();
  const { workouts, loading, deleteWorkout, updateWorkout, fetchWorkouts } =
    useWorkouts();
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);

  const filtered = workouts.filter(
    (w) => filter === "all" || w.status === filter
  );
const handleDeleteWorkout = async (workoutId) => {
  const result = await Swal.fire({
    title: "Delete Workout?",
    text: "This workout will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteWorkout(workoutId);

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Workout deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire(
      "Error",
      err?.response?.data?.message || "Failed to delete workout",
      "error"
    );
  }
};



  if (loading) {
    return (
      <p className="text-center text-text-muted mt-8">Loading workouts...</p>
    );
  }

  return (
    <>
      <div className="mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-text-highlight">Workouts</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-button-primary rounded-lg text-text-inverted hover:brightness-90 transition"
          >
            <StretchHorizontal size={18} /> New Workout
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            "all",
            "scheduled",
            "upcoming",
            "in-progress",
            "completed",
            "missed",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === f
                  ? "bg-brand-secondary text-text-base"
                  : "bg-surface-card-alt text-text-base hover:bg-surface-hover"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <div
              key={w._id}
              className="bg-surface-card p-5 rounded-xl border border-border-card shadow-xl"
            >
              <div className="flex justify-between items-center bg-surface transition mb-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Calendar size={14} />
                    <span>{new Date(w.date).toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col items-start justify-between w-full">
                    <p className="font-semibold text-text-base text-lg truncate  max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[190px] xl:max-w-[220px]">
                      {w.name}
                    </p>

                    <div className="shrink-0">{getStatusBadge(w.status)}</div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  {/* EDIT */}
                  {(w.status === "scheduled" || w.status === "upcoming") && (
                    <button
                      onClick={() => setEditWorkout(w)}
                      className="p-2 bg-brand-accent/10 text-button-edit rounded-full hover:bg-brand-accent hover:text-white transition"
                      title="Edit Workout"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}

                  {/* START */}
                  {w.status === "upcoming" && (
                    <button
                      onClick={() => {
                        updateWorkout(w._id, { status: "in-progress" });
                        navigate(`/dashboard/start/${w._id}`);
                      }}
                      className="p-2 bg-success/10 text-success rounded-full hover:bg-success hover:text-white transition"
                      title="Start Workout"
                    >
                      <Play size={16} />
                    </button>
                  )}

                  {/* COMPLETE */}
                  {w.status === "in-progress" && (
                    <button
                      onClick={() =>
                        updateWorkout(w._id, { status: "completed" })
                      }
                      className="p-2 bg-success/10 text-success rounded-full hover:bg-success hover:text-white transition"
                      title="Mark as Complete"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}

                  {/* DELETE */}
               <button
  onClick={() => handleDeleteWorkout(w._id)}
  className="p-2 bg-error/10 text-error rounded-full hover:bg-error hover:text-white transition"
  title="Delete Workout"
>
  <Trash2 size={16} />
</button>

                </div>
              </div>

              <div className="space-y-1 text-sm">
                {w.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Dumbbell size={12} className="text-brand-primary" />
                    <span className="text-text-muted">
                      {ex.name} — {ex.sets}×{ex.reps}{" "}
                      {ex.weight > 0 && `@ ${ex.weight}kg`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <AddWorkoutModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchWorkouts();
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editWorkout && (
        <EditWorkoutModal
          workout={editWorkout}
          onClose={() => setEditWorkout(null)}
          onSave={() => {
            setEditWorkout(null);
            fetchWorkouts();
          }}
        />
      )}
    </>
  );
}
