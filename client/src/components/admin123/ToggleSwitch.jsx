"use client";

export const ToggleSwitch = ({ id, name, label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between min-h-[2.5rem]">
      {/* Phần Label hiển thị bên trái */}
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-[#475d5b] cursor-pointer select-none mr-3"
      >
        {label}
      </label>
      
      {/* Phần Nút gạt (Switch) hiển thị bên phải */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        
        {/* Thanh trượt (Track) */}
        <div className="w-11 h-6 bg-gray-200 
                        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#faae2b] 
                        rounded-full peer 
                        peer-checked:bg-[#00473e]
                        
                        /* Viên bi (Knob) */
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all 
                        peer-checked:after:translate-x-full peer-checked:after:border-white">
        </div>
      </label>
    </div>
  );
};