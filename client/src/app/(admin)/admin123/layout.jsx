'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard'; // dùng file mới ở trên
import { useState } from "react";
// Đường dẫn đã sửa: đi ra 2 cấp (khỏi admin123, khỏi (admin)) để vào app, rồi vào components
import Sidebar from "@/components/admin123/Sidebar";
import Header from "@/components/admin123/Header";

export default function AdminLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <AuthGuard allowedRoles={[1]}>
    <div className="flex h-screen bg-[#f2f7f5] text-[#475d5b]">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isCollapsed={isSidebarCollapsed} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Nội dung của page.jsx con sẽ được render ở đây */}
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}