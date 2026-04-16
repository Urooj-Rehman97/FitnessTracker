// frontend/src/components/progress/ProgressChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProgressChart({ data, field, label, color }) {
  const chartData = data
    .filter((p) => p[field])
    .map((p) => ({
      date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: p[field],
    }));

  if (chartData.length === 0) {
    return <p className="text-center text-gray-400">No data for {label || field}</p>;
  }

  return (
    <div className="h-64">
      <h3 className="text-sm font-medium text-gray-300 mb-2">{label || field}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
            labelStyle={{ color: "#fbbf24" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color || "#f59e0b"}
            strokeWidth={3}
            dot={{ fill: color || "#f59e0b" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}