"use client";

import { User } from "lucide-react";

export const FormInput = ({ 
  id, 
  name, 
  label, 
  type = "text", 
  value, 
  onChange, 
  icon, 
  autoComplete = "off", 
  required = false 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[#475d5b] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {/* Dùng icon được truyền vào, hoặc fallback về icon User */}
        {icon || <User className="h-5 w-5 text-gray-400" />}
      </span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b] focus:border-transparent"
      />
    </div>
  </div>
);