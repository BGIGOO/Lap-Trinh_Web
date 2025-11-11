"use client";

import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // SỬA LỖI:
    // Đây là cú pháp JIT của Tailwind, chắc chắn sẽ hoạt động.
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex justify-center items-center p-4">
      {/* Đây là nội dung Modal */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-[#00473e]">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};