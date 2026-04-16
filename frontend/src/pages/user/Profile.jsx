// src/pages/user/Profile.jsx
import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import {
  Edit2,
  Camera,
  RefreshCw,
  ArrowLeft,
  Mail,
  Ruler,
  Scale,
  Target,
  Activity,
  Shield,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    fitnessGoal: "general_fitness",
    activityLevel: "moderate",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        gender: user.gender || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        fitnessGoal: user.fitnessGoal || "general_fitness",
        activityLevel: user.activityLevel || "moderate",
      });
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 800); // spin animation duration before reload
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value || "");
    });
    if (fileInputRef.current?.files?.[0]) {
      submitData.append("profilePicture", fileInputRef.current.files[0]);
    }

    try {
      await axiosInstance.put(`${API_URL}/api/auth/profile`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!", {
        icon: "Success",
        duration: 4000,
      });
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-xl text-text-muted animate-pulse">
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-surface-page pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-surface-page/95 backdrop-blur z-10 border-b border-border-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Back / Cancel button */}
          {user?.role !== "admin" && (
            <button
              onClick={() => (isEditing ? setIsEditing(false) : navigate(-1))}
              className="flex items-center gap-2 text-text-base hover:text-brand-primary transition font-medium"
            >
              <ArrowLeft size={22} />
              {isEditing ? "Cancel" : "Back"}
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2.5 bg-surface-card-alt rounded-xl hover:bg-surface-input transition cursor-pointer`}
              title="Reload"
            >
              <RefreshCw
                size={18}
                className={`text-brand-primary transition-transform ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-black rounded-xl font-semibold hover:bg-brand-secondary transition shadow-lg"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="relative">
              <img
                src={
                  previewUrl || user?.profilePicture || "/default-avatar.png"
                }
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-8 border-brand-primary/20 shadow-2xl"
              />
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-3 bg-brand-primary rounded-full hover:bg-brand-secondary transition shadow-xl hover:scale-110"
                >
                  <Camera size={22} className="text-black" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Admin Badge */}
            {user?.role === "admin" && !isEditing && (
              <div className="absolute top-30 -right-9 bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Shield size={14} />
                ADMIN
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-text-base mt-6">
            {isEditing ? (
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="text-center bg-transparent border-b-4 border-brand-primary outline-none font-bold text-4xl max-w-sm"
                placeholder="Your Name"
              />
            ) : (
              user?.username || "Fitness Beast"
            )}
          </h1>
          <p className="text-lg text-text-muted mt-3 flex items-center justify-center gap-2">
            <Mail size={20} /> {user?.email}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-surface-card border border-border-card rounded-3xl p-8 shadow-2xl">
          {isEditing ? (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <User
                    className="absolute left-4 top-4 text-brand-primary"
                    size={20}
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-surface-input border-2 border-border-input rounded-2xl text-text-base focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <label className="absolute -top-3 left-4 bg-surface-card px-2 text-xs text-text-muted font-medium">
                    Gender
                  </label>
                </div>

                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-4 text-brand-primary"
                    size={20}
                  />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full pl-12 pr-4 py-4 bg-surface-input border-2 border-border-input rounded-2xl text-text-base focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition"
                  />
                  <label className="absolute -top-3 left-4 bg-surface-card px-2 text-xs text-text-muted font-medium">
                    Age
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <Ruler
                    className="absolute left-4 top-4 text-brand-primary"
                    size={20}
                  />
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175"
                    className="w-full pl-12 pr-4 py-4 bg-surface-input border-2 border-border-input rounded-2xl text-text-base focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition"
                  />
                  <label className="absolute -top-3 left-4 bg-surface-card px-2 text-xs text-text-muted font-medium">
                    Height (cm)
                  </label>
                </div>

                <div className="relative">
                  <Scale
                    className="absolute left-4 top-4 text-brand-primary"
                    size={20}
                  />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full pl-12 pr-4 py-4 bg-surface-input border-2 border-border-input rounded-2xl text-text-base focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition"
                  />
                  <label className="absolute -top-3 left-4 bg-surface-card px-2 text-xs text-text-muted font-medium">
                    Weight (kg)
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <Target
                    className="absolute left-4 top-4 text-brand-primary"
                    size={20}
                  />
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-surface-input border-2 border-border-input rounded-2xl text-text-base focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                  <label className="absolute -top-3 left-4 bg-surface-card px-2 text-xs text-text-muted font-medium">
                    Fitness Goal
                  </label>
                </div>

                <div className="relative">
                  <Activity
                    className="absolute left-4 top-4 text-brand-primary"
                    size={20}
                  />
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-surface-input border-2 border-border-input rounded-2xl text-text-base focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                  <label className="absolute -top-3 left-4 bg-surface-card px-2 text-xs text-text-muted font-medium">
                    Activity Level
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <p className="text-text-muted text-sm font-medium">Gender</p>
                  <p className="text-2xl font-semibold capitalize mt-1">
                    {user?.gender || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm font-medium">Age</p>
                  <p className="text-2xl font-semibold mt-1">
                    {user?.age ? `${user.age} years` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm font-medium flex items-center gap-2">
                    <Ruler size={18} /> Height
                  </p>
                  <p className="text-2xl font-bold text-brand-primary mt-1">
                    {user?.height ? `${user.height} cm` : "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-text-muted text-sm font-medium">Weight</p>
                  <p className="text-2xl font-bold text-brand-primary mt-1">
                    {user?.weight ? `${user.weight} kg` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm font-medium">
                    Fitness Goal
                  </p>
                  <p className="text-2xl font-semibold capitalize mt-1">
                    {user?.fitnessGoal?.replace("_", " ") || "General Fitness"}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm font-medium">
                    Activity Level
                  </p>
                  <p className="text-2xl font-semibold capitalize mt-1">
                    {user?.activityLevel || "Moderate"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Save/Cancel Bar */}
        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-surface-page border-t border-border-card shadow-2xl">
            <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
              <p className="text-text-muted text-sm">
                Unsaved changes will be lost
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewUrl(user?.profilePicture);
                  }}
                  className="px-8 py-3 bg-surface-card-alt rounded-xl font-medium hover:bg-surface-input transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-10 py-3 bg-linear-to-r from-brand-primary to-brand-secondary text-black rounded-xl font-bold hover:scale-105 transition shadow-lg disabled:opacity-70 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
