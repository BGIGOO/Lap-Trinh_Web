"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "./UserDropdown";

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 bg-white h-20 flex items-center justify-between px-6 shadow-sm border-b border-gray-200">
      {/* Trái: Menu & Search */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-[#00473e] hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#faae2b]"
          />
        </div>
      </div>

      {/* Phải: Chuông & User */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-[#00473e] hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[#fa5246]"></span>
        </button>

        {/* User + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 text-[#00473e] p-1 flex items-center justify-center">
              <span className="font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-[#00473e]">
                {user?.name || user?.username || "Loading..."}
              </p>
              <p className="text-xs text-[#475d5b]">
                {user?.email || "..."}
              </p>
            </div>
          </button>

          {isDropdownOpen && user && (
            <UserDropdown
              user={user}
              logout={logout}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
