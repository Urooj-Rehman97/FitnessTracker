// src/pages/admin/UserManagement.jsx → FINAL GOD-TIER VERSION

import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Shield,
  Ban,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  Calendar,
  Weight,
  Target,
  Activity,
  Clock,
  X,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/admin/users");
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // OPEN MODAL WITH FULL USER DATA
  const handleViewUser = async (userId) => {
    try {
      const { data } = await axiosInstance.get(`/api/admin/users/${userId}`);
      setSelectedUser(data);
      setModalOpen(true);
    } catch (err) {
      toast.error("Failed to load user profile");
    }
  };

const handleToggleStatus = async (userId, currentStatus) => {
  const result = await Swal.fire({
    title: currentStatus ? "Deactivate User?" : "Activate User?",
    text: currentStatus
      ? "User will not be able to login. Email will be sent."
      : "User account will be activated and email will be sent.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: currentStatus ? "#ef4444" : "#22c55e",
    cancelButtonColor: "#6b7280",
    confirmButtonText: currentStatus ? "Yes, Deactivate" : "Yes, Activate",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.patch(
      `/api/admin/users/${userId}/toggle-status`
    );

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `User ${
        currentStatus ? "deactivated" : "activated"
      } successfully & email sent.`,
      timer: 1600,
      showConfirmButton: false,
    });

    fetchUsers();
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Action failed",
      "error"
    );
  }
};


const handleDelete = async (userId) => {
  const result = await Swal.fire({
    title: "Delete User Permanently?",
    html: `
      <p>This action <b>cannot be undone</b>.</p>
      <p class="mt-1">User data will be removed & email will be sent.</p>
    `,
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete User",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.delete(`/api/admin/users/${userId}`);

    Swal.fire({
      icon: "success",
      title: "User Deleted",
      text: "User deleted permanently & email sent.",
      timer: 1600,
      showConfirmButton: false,
    });

    setUsers(users.filter((u) => u._id !== userId));
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Delete failed",
      "error"
    );
  }
};


  if (loading) {
    return (
      <div className="p-12 text-center">
        <RefreshCw className="animate-spin inline-block w-12 h-12 text-brand-primary" />
        <p className="text-text-muted mt-4">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-text-base flex items-center gap-3">
              <Shield className="w-10 h-10 text-brand-primary" />
              User Management
            </h1>
            <p className="text-text-muted mt-2">
              Full control with email notifications
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-5 py-3 bg-surface-card border border-border-card rounded-xl hover:border-brand-primary hover:shadow-lg transition-all cursor-pointer"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface-card border border-border-card rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-card-alt border-b-2 border-border-card">
                <tr>
                  <th className="text-left p-5 text-text-muted font-semibold">
                    #
                  </th>
                  <th className="text-left p-5 text-text-muted font-semibold">
                    User
                  </th>
                  <th className="text-left p-5 text-text-muted font-semibold">
                    Email
                  </th>
                  <th className="text-left p-5 text-text-muted font-semibold">
                    Role
                  </th>
                  <th className="text-left p-5 text-text-muted font-semibold">
                    Status
                  </th>
                  <th className="text-left p-5 text-text-muted font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user._id}
                    className="border-b border-border-card hover:bg-surface-hover transition-all"
                  >
                    <td className="p-5 text-text-muted">{i + 1}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={
                              user.profilePicture ||
                              "https://res.cloudinary.com/dk6pkgyak/image/upload/v1761949436/default-avatar_e2tpup.jpg"
                            }
                            alt={user.username}
                            className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary/30 shadow-lg"
                            onError={(e) =>
                              (e.target.src =
                                "https://res.cloudinary.com/dk6pkgyak/image/upload/v1761949436/default-avatar_e2tpup.jpg")
                            }
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-surface-card ${
                              user.isActive ? "bg-success" : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-xs text-text-muted">
                            ID: {user._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-text-muted">{user.email}</td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-surface-card-alt"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.isActive
                            ? "bg-success/20 text-success"
                            : "bg-error/20 text-error"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2">
                        {user.role !== "admin" ? (
                          <>
                            <button
                              onClick={() => handleViewUser(user._id)}
                              className="p-2 hover:bg-surface-card-alt rounded-lg transition-all cursor-pointer"
                            >
                              <Eye size={18} className="text-brand-primary" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(user._id, user.isActive)
                              }
                              className="p-2 hover:bg-surface-card-alt rounded-lg cursor-pointer"
                            >
                              {user.isActive ? (
                                <Ban size={18} className="text-warning" />
                              ) : (
                                <CheckCircle
                                  size={18}
                                  className="text-success"
                                />
                              )}
                            </button>

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 hover:bg-error/20 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={18} className="text-error" />
                            </button>
                          </>
                        ) : (
                          <span className="text-text-muted text-sm">
                            Admin actions hidden
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* USER PROFILE MODAL - FULLY UPDATED WITH STATS */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border-card flex justify-between items-center sticky top-0 bg-surface-card z-10">
              <h2 className="text-2xl font-bold text-text-base flex items-center gap-3">
                <User className="w-8 h-8 text-brand-primary" />
                User Profile
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-3 hover:bg-surface-hover rounded-xl transition-all"
              >
                <X size={26} className="text-text-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative group">
                  <img
                    src={
                      selectedUser.profilePicture ||
                      "https://res.cloudinary.com/dk6pkgyak/image/upload/v1761949436/default-avatar_e2tpup.jpg"
                    }
                    alt={selectedUser.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-brand-primary/30 shadow-2xl ring-4 ring-brand-primary/10 group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <h3 className="text-4xl font-bold text-text-base">
                    {selectedUser.username}
                  </h3>
                  <p className="text-xl text-text-muted flex items-center justify-center sm:justify-start gap-2">
                    <Mail size={18} />
                    {selectedUser.email}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        selectedUser.role === "admin"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                          : "bg-surface-card-alt text-text-muted"
                      }`}
                    >
                      {selectedUser.role.toUpperCase()}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                        selectedUser.isActive
                          ? "bg-success/20 text-success border border-success/50"
                          : "bg-error/20 text-error border border-error/50"
                      }`}
                    >
                      {selectedUser.isActive
                        ? "Active Account"
                        : "Inactive Account"}
                    </span>
                  </div>
                  <p className="text-sm text-brand-primary mt-3">
                    Member since{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              {/* Stats Grid - YE WAHI TERA CHAHIYE THA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-surface-card-alt p-6 rounded-2xl border border-border-card hover:border-brand-primary/50 transition-all hover:shadow-xl">
                  <Activity className="w-12 h-12 mx-auto text-brand-primary mb-3" />
                  <p className="text-3xl font-bold text-text-base">
                    {selectedUser.stats.totalWorkouts}
                  </p>
                  <p className="text-text-muted text-sm mt-1">Total Workouts</p>
                </div>
                <div className="bg-surface-card-alt p-6 rounded-2xl border border-border-card hover:border-purple-500/50 transition-all hover:shadow-xl">
                  <Calendar className="w-12 h-12 mx-auto text-purple-400 mb-3" />
                  <p className="text-3xl font-bold text-text-base">
                    {selectedUser.stats.totalProgressLogs}
                  </p>
                  <p className="text-text-muted text-sm mt-1">Progress Logs</p>
                </div>
                <div className="bg-surface-card-alt p-6 rounded-2xl border border-border-card hover:border-success/50 transition-all hover:shadow-xl">
                  <Target className="w-12 h-12 mx-auto text-success mb-3" />
                  <p className="text-3xl font-bold text-text-base">
                    {selectedUser.stats.totalNutritionEntries}
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    Nutrition Entries
                  </p>
                </div>
              </div>

              {/* Last Active + Account Age */}
              <div className="bg-surface-card-alt p-6 rounded-2xl border border-border-card text-center">
                <p className="text-lg text-text-base font-semibold">
                  Last Active:{" "}
                  <span className="text-brand-primary">
                    {selectedUser.stats.lastActive}
                  </span>
                </p>
                <p className="text-text-muted mt-2">
                  Account Age:{" "}
                  <span className="font-bold text-brand-primary">
                    {selectedUser.stats.accountAgeDays} days
                  </span>
                </p>
              </div>

              {/* Fitness Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-card-alt p-5 rounded-xl border border-border-card">
                  <div className="flex items-center gap-4">
                    <Weight className="w-10 h-10 text-brand-primary" />
                    <div>
                      <p className="text-text-muted text-sm">Current Weight</p>
                      <p className="text-2xl font-bold">
                        {selectedUser.weight
                          ? `${selectedUser.weight} kg`
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-card-alt p-5 rounded-xl border border-border-card">
                  <div className="flex items-center gap-4">
                    <Target className="w-10 h-10 text-success" />
                    <div>
                      <p className="text-text-muted text-sm">Fitness Goal</p>
                      <p className="text-2xl font-bold capitalize">
                        {selectedUser.fitnessGoal?.replace(/_/g, " ") ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
