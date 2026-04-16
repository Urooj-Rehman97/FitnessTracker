// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [newUsersChart, setNewUsersChart] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeUsersThisWeek: 0,
    totalWorkouts: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // 🔹 Fetch users (updated route)
      const usersRes = await axiosInstance.get("/api/admin/users");
      const usersData = usersRes.data;

      // 🔹 Fetch workouts (already admin route, make sure it matches backend)
      const workoutsRes = await axiosInstance.get("/api/admin/workouts");
      const workoutsData = workoutsRes.data || [];
      setWorkouts(workoutsData);

      const now = new Date();
      const totalUsers = usersData.length;

      const newThisMonth = usersData.filter((u) => {
        const created = new Date(u.createdAt);
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      });

      const activeThisWeek = usersData.filter((u) => {
        if (!u.lastLogin) return false;
        const diff = (now - new Date(u.lastLogin)) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      });

      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const count = newThisMonth.filter(
          (u) => new Date(u.createdAt).getDate() === day
        ).length;
        return { day: `${day}`, count };
      });

      setAnalytics({
        totalUsers,
        newUsersThisMonth: newThisMonth.length,
        activeUsersThisWeek: activeThisWeek.length,
        totalWorkouts: workoutsData.length,
      });

      setNewUsersChart(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text-base flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-brand-primary" />
            Admin Command Center
          </h1>
          <p className="text-text-muted mt-2">
            Monitor growth, engagement & performance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={<Users className="w-8 h-8 text-brand-primary" />}
        />
        <StatCard
          title="New This Month"
          value={`+${analytics.newUsersThisMonth}`}
          icon={<UserPlus className="w-8 h-8 text-success" />}
        />
        <StatCard
          title="Active This Week"
          value={analytics.activeUsersThisWeek}
          icon={<Activity className="w-8 h-8 text-brand-primary" />}
        />
        <StatCard
          title="Total Workouts Logged"
          value={analytics.totalWorkouts}
          icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
        />
      </div>

      {/* Chart */}
      <div className="bg-surface-card border border-border-card rounded-2xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-text-base mb-6 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-brand-primary" />
          New User Growth (This Month)
        </h2>
        <div className="h-80 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={newUsersChart}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="count" fill="#fbbf24" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Small reusable component for stats card
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-surface-card border border-border-card rounded-2xl p-6 hover:border-brand-primary/50 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm">{title}</p>
          <p className="text-4xl font-bold text-text-base mt-2">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="p-4 bg-brand-primary/10 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}
