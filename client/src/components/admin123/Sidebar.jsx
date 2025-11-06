"use client";

import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  User,
} from "lucide-react";

// Component con cho từng mục menu
function SidebarItem({ icon, text, href, isCollapsed }) {
  const { user , logout } = useAuth();
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-3 text-[#475d5b] rounded-lg hover:bg-[#e0e8e6] group"
    >
      {icon}
      <span
        className={`ml-3 overflow-hidden transition-all ${
          isCollapsed ? "w-0" : "w-auto"
        }`}
      >
        {text}
      </span>
    </Link>
  );
}

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  return (
    <aside
      className={`bg-white h-screen shadow-md flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <div
          className={`text-2xl font-bold text-[#00473e] transition-all ${
            isCollapsed ? "text-base" : "text-2xl"
          }`}
        >
          {isCollapsed ? <LayoutDashboard className="h-5 w-5" /> : "DASHBOARD"}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          text="Dashboard"
          href="/admin123"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<ShoppingCart className="h-5 w-5" />}
          text="Đơn hàng"
          href="/admin123/orders"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Package className="h-5 w-5" />}
          text="Sản phẩm"
          href="/admin123/products"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          text="Khách hàng"
          href="/admin123/customers"
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Toggle Button & Settings */}
      <div className="p-4 border-t border-gray-200">
        <SidebarItem
          icon={<User className="h-5 w-5" />}
          text="Thông tin tài khoản"
          href="/admin123/settings"
          isCollapsed={isCollapsed}
        />
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full mt-4 p-3 text-[#00473e] rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}