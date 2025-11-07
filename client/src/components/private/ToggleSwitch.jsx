"use client";

export const ToggleSwitch = ({ id, label, checked, onChange, name }) => (
  <div className="flex items-center">
    <div className="flex items-center h-5">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-5 w-5 text-[#00473e] rounded focus:ring-[#faae2b]"
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={id} className="font-medium text-[#475d5b]">
        {label}
      </label>
      <p className="text-xs text-gray-500">
        {checked ? "Tài khoản đang được kích hoạt." : "Tài khoản đang bị vô hiệu hóa."}
      </p>
    </div>
  </div>
);