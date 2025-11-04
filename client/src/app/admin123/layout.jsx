// 'use client' không cần ở đây nữa, vì Guard sẽ xử lý

import React from 'react';
// 1. Import 'AuthGuard' mới
import AuthGuard from '@/components/AdminAuthGuard'; 
// (Đổi tên file AdminAuthGuard.jsx -> AuthGuard.jsx nếu muốn)

// 2. Đây là danh sách role ĐƯỢC PHÉP vào /admin123
const ADMIN_ROLES = [1, 2]; // (Giả sử 1=Admin, 2=Employee)

export default function AdminLayout({ children }) {
  return (
    // 3. Bọc children bằng Guard và truyền role
    <AuthGuard allowedRoles={ADMIN_ROLES}>
      <div className="admin-container">
        <aside>
          <h2>Admin Menu</h2>
          {/* ... (menu của bạn) ... */}
        </aside>
        <main>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

