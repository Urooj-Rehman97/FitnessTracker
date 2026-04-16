// frontend/src/hooks/useNutritions.js
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useNutrition = () => {
  const [nutritions, setNutritions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get today's local date in YYYY-MM-DD format
  const getTodayLocalDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };

  // FETCH ALL (with date filter)
  const fetchNutritions = async (date = null) => {
    setLoading(true);
    try {
      const today = getTodayLocalDate();
      const url = date
        ? `/api/nutrition?date=${date}`
        : `/api/nutrition?date=${today}`;
      const res = await axiosInstance.get(url);
      setNutritions(res.data);
    } catch (err) {
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  // CREATE NEW MEAL
  const createNutrition = async (payload) => {
    try {
      const res = await axiosInstance.post("/api/nutrition", payload);
      toast.success("Meal added!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add meal");
      throw err;
    }
  };

  // UPDATE MEAL
  const updateNutrition = async (id, payload) => {
    try {
      const res = await axiosInstance.put(`/api/nutrition/${id}`, payload);
      toast.success("Meal updated!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
      throw err;
    }
  };

  // DELETE MEAL
  const deleteNutrition = async (id) => {
    try {
      await axiosInstance.delete(`/api/nutrition/${id}`);
      toast.success("Meal deleted!");
    } catch (err) {
      toast.error("Failed to delete");
      throw err;
    }
  };

  useEffect(() => {
    fetchNutritions();
  }, []);

  return {
    nutritions,
    loading,
    fetchNutritions,
    createNutrition,
    updateNutrition,
    deleteNutrition,
  };
};

export default useNutrition;
