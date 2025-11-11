import React from "react";

// Đây có thể là một Server Component, không cần "use client"
export default function StatCard({
  title,
  value,
  icon,
  change,
  changeType = "positive",
}) {
  const changeColor =
    changeType === "positive" ? "text-green-600" : "text-red-600";
  const iconBgColor =
    changeType === "positive" ? "bg-green-100" : "bg-red-100";
  const iconColor =
    changeType === "positive" ? "text-green-700" : "text-red-700";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-[#475d5b]">{title}</span>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          {React.cloneElement(icon, { className: `h-6 w-6 ${iconColor}` })}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-[#00473e] mb-1">{value}</h3>
        {change && (
          <p className={`text-sm ${changeColor}`}>{change} so với tháng trước</p>
        )}
      </div>
    </div>
  );
}