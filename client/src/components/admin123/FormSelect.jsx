"use client";

import { ChevronDown } from "lucide-react";

export const FormSelect = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  icon, 
  options = [], 
  required = false 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#475d5b] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] focus:border-transparent bg-white appearance-none cursor-pointer"
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* Icon mũi tên bên phải để user biết đây là dropdown */}
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </span>
    </div>
  </div>
);