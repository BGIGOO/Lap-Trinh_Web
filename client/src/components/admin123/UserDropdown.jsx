"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { UserCircle2, Settings, LogOut } from "lucide-react";

export default function UserDropdown({ user, logout, onClose }) {
  const dropdownRef = useRef(null);

  // Logic để đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, onClose]);

  // Sử dụng optional chaining '?' để an toàn hơn
  const displayName = user?.name || "Admin";
  const isActive = user?.is_active;

  // Xác định text và màu sắc dựa trên trạng thái
  const statusText = isActive ? "Đang hoạt động" : "Không hoạt động";
  const statusColorClass = isActive ? "bg-green-400" : "bg-red-500";
  const statusTextColorClass = isActive ? "text-gray-200" : "text-gray-300";

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
      style={{
        // Thêm một viền nhỏ màu highlight
        borderTop: "2px solid #faae2b",
      }}
    >
      {/* Phần Header của Dropdown (ĐÃ CẬP NHẬT) */}
      <div className="p-4 bg-[#00473e] text-white">
        <h4 className="font-bold text-base truncate">{displayName}</h4>
        
        {/* Cập nhật logic hiển thị trạng thái */}
        <div className="flex items-center mt-1">
          <span className={`h-2 w-2 ${statusColorClass} rounded-full mr-2`}></span>
          <span className={`text-xs ${statusTextColorClass}`}>{statusText}</span>
        </div>
      </div>

      {/* Phần Menu Links */}
      <nav className="p-2">
        <Link
          href="/admin123/account" // Cập nhật đường dẫn nếu cần
          onClick={onClose}
          className="flex items-center px-3 py-2 text-[#475d5b] hover:bg-[#f2f7f5] rounded-lg transition-colors"
        >
          <UserCircle2 className="h-5 w-5 mr-3" />
          <span>Tài khoản của tôi</span>
        </Link>
        {/* <Link
          href="/admin123/settings" // Cập nhật đường dẫn nếu cần
          onClick={onClose}
          className="flex items-center px-3 py-2 text-[#475d5b] hover:bg-[#f2f7f5] rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5 mr-3" />
          <span>Cài đặt</span>
        </Link> */}
        <button
          onClick={() => {
            onClose();
            logout(); // Gọi hàm logout từ AuthContext
          }}
          className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
}