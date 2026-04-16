// src/pages/user/StartWorkoutPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWorkouts from "../../hooks/useWorkouts";
import {
  Timer,
  Dumbbell,
  Play,
  Pause,
  X,
  CheckCircle,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";

export default function StartWorkoutPage() {
  const params = useParams();
  const workoutId = params.workoutId || params.id || Object.values(params)[0];
  const navigate = useNavigate();
  const { workouts, updateWorkout, finishWorkout } = useWorkouts();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workoutId || workouts.length === 0) return;

    const found = workouts.find((w) => String(w._id) === String(workoutId));
    if (found) {
      setWorkout(found);
      setLoading(false);
    } else {
      toast.error("Workout not found!");
      navigate("/dashboard");
    }
  }, [workouts, workoutId, navigate]);

  if (loading || !workout) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 bg-bg-primary">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-primary border-t-transparent"></div>
        <p className="text-2xl font-semibold text-text-muted">
          Loading Workout...
        </p>
      </div>
    );
  }

  return (
    <WorkoutPlayer
      workout={workout}
      updateWorkout={updateWorkout}
      onClose={() => navigate("/dashboard")}
    />
  );
}

function WorkoutPlayer({ workout, updateWorkout, onClose }) {
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  const exercise = workout.exercises[currentExercise];
  const totalSets = exercise?.sets || 0;
  const isLastSet = currentSet === totalSets;
  const isLastExercise = currentExercise === workout.exercises.length - 1;

  useEffect(() => {
    let interval;
    if (isRunning && !isResting) {
      interval = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    } else if (isResting && restSeconds > 0) {
      interval = setInterval(() => setRestSeconds((s) => s - 1), 1000);
    } else if (isResting && restSeconds === 0) {
      setIsResting(false);
      setIsRunning(true);
      setRestSeconds(90);
    }
    return () => clearInterval(interval);
  }, [isRunning, isResting, restSeconds]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const completeSet = async () => {
    const key = `${currentExercise}-${currentSet}`;
    setCompletedSets((prev) => ({ ...prev, [key]: true }));

    if (isLastSet && isLastExercise) {
      // await updateWorkout(workout._id, { status: "completed" });
      // toast.success("Workout Completed! Great Job!");

      try {
        await finishWorkout(workout._id);
        toast.success("Workout Completed! Goal Updated!");
      } catch (err) {
        toast.error("Failed to finish workout");
      }
      navigate("/dashboard");
      return;
    }

    if (isLastSet) {
      setCurrentExercise((e) => e + 1);
      setCurrentSet(1);
    } else {
      setCurrentSet((s) => s + 1);
    }

    setIsResting(true);
    setIsRunning(false);
  };

  const toggleTimer = async () => {
    if (!isRunning && totalSeconds === 0) {
      await updateWorkout(workout._id, { status: "in-progress" });
    }
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="bg-linear-to-br from-bg-primary to-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-lg border-b border-border-card">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-3xl font-black text-brand-primary tracking-tight">
            {workout.name}
          </h1>
          <button
            onClick={onClose}
            className="p-3 hover:bg-surface-hover rounded-full transition-all"
          >
            <X size={28} className="text-text-muted" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8 space-y-8">
        {/* Total Timer */}
        <div className="text-center">
          <div className="text-8xl font-black text-brand-primary font-mono tracking-tighter">
            {formatTime(totalSeconds)}
          </div>
          <p className="text-text-muted mt-2">Total Time</p>
        </div>

        {/* Current Exercise Card */}
        <div className="bg-surface-card rounded-3xl p-8 shadow-2xl border border-brand-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-black text-text-base">
              {exercise.name}
            </h2>
            <Flame className="text-brand-primary" size={36} />
          </div>

          <p className="text-2xl text-text-muted mb-8 font-medium">
            Set{" "}
            <span className="text-brand-primary font-bold">{currentSet}</span>{" "}
            of {totalSets} • {exercise.reps} reps
            {exercise.weight > 0 && (
              <span className="text-success font-bold">
                {" "}
                @ {exercise.weight}kg
              </span>
            )}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-surface-hover rounded-full h-6 mb-10 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-brand-primary to-success transition-all duration-700 rounded-full shadow-lg"
              style={{ width: `${(currentSet / totalSets) * 100}%` }}
            />
          </div>

          {/* Rest or Complete */}
          {isResting ? (
            <div className="text-center py-16">
              <div className="text-9xl font-black text-brand-primary mb-4 font-mono">
                {formatTime(restSeconds)}
              </div>
              <p className="text-3xl font-bold text-text-muted">Rest Time</p>
            </div>
          ) : (
            <button
              onClick={completeSet}
              disabled={completedSets[`${currentExercise}-${currentSet}`]}
              className={`w-full py-8 rounded-3xl text-3xl font-bold transition-all transform hover:scale-105 shadow-2xl ${
                completedSets[`${currentExercise}-${currentSet}`]
                  ? "bg-success text-white"
                  : "bg-linear-to-r from-brand-primary to-success text-white"
              }`}
            >
              {completedSets[`${currentExercise}-${currentSet}`] ? (
                <>
                  Set Done <CheckCircle className="inline ml-4" size={40} />
                </>
              ) : (
                "Complete Set"
              )}
            </button>
          )}
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {workout.exercises.map((ex, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl flex items-center justify-between transition-all border-2 ${
                i === currentExercise
                  ? "bg-brand-primary/10 border-brand-primary shadow-xl scale-105"
                  : "bg-surface-card border-transparent"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`p-3 rounded-full ${
                    i === currentExercise
                      ? "bg-brand-primary"
                      : "bg-surface-hover"
                  }`}
                >
                  <Dumbbell
                    size={28}
                    className={
                      i === currentExercise ? "text-white" : "text-text-muted"
                    }
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{ex.name}</p>
                  <p className="text-text-muted text-lg">
                    {ex.sets}×{ex.reps} {ex.weight > 0 && `@ ${ex.weight}kg`}
                  </p>
                </div>
              </div>
              {i < currentExercise && (
                <CheckCircle size={32} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Play/Pause Button — AB CHHOTA AUR SEXY! */}
      <div className="flex justify-center mt-12">
        <button
          onClick={toggleTimer}
          className="relative p-8 bg-linear-to-br from-brand-primary/10 via-brand-primary/5 to-transparent rounded-full border border-brand-primary/30 shadow-2xl hover:shadow-brand-primary/20 hover:border-brand-primary/60 transition-all duration-400 group"
        >
          <div className="absolute inset-0 rounded-full bg-brand-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative">
            {isRunning ? (
              <Pause size={44} className="text-brand-primary" strokeWidth={3} />
            ) : (
              <Play
                size={44}
                className="text-brand-primary ml-2"
                strokeWidth={3}
              />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
