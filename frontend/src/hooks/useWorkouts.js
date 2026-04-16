// src/hooks/useWorkouts.js
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all
  const fetchWorkouts = async () => {
    try {
      const res = await axiosInstance.get("/api/workouts");
      setWorkouts(res.data.workouts);
    } catch (err) {
      toast.error("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  // Create
  const createWorkout = async (data) => {
    try {
      await axiosInstance.post("/api/workouts", data);
      toast.success("Workout saved!");
      fetchWorkouts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // Update
  const updateWorkout = async (id, data) => {
    try {
      await axiosInstance.put(`/api/workouts/${id}`, data);
      toast.success("Workout updated!");
      fetchWorkouts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Delete
  const deleteWorkout = async (id) => {
    if (!confirm("Delete this workout?")) return;
    try {
      await axiosInstance.delete(`/api/workouts/${id}`);
      toast.success("Deleted!");
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const finishWorkout = async (id) => {
    try {
      const res = await axiosInstance.post(`/api/workouts/${id}/finish`);
      toast.success(
        `Workout Completed! +${res.data.caloriesBurned} kcal burned!`
      );
      fetchWorkouts();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to finish workout");
      throw err;
    }
  };
  useEffect(() => {
    fetchWorkouts();
  }, []);

  return {
    workouts,
    loading,
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    finishWorkout,
  };
};

export default useWorkouts;
