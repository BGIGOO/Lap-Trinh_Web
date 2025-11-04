import React from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard'; // 1. Import "Gác cổng"

// Đây là layout "bọc" tất cả các trang admin (dashboard, statistics...)
export default function AdminLayout({ children }) {
  return (
    // 2. Dùng "Gác cổng" bọc lấy toàn bộ layout
    <AdminAuthGuard>
      <div className="admin-container" style={{ display: 'flex' }}>
        <aside style={{ width: '250px', background: '#f0f0f0', padding: '1rem' }}>
          {/* Bạn có thể đặt menu (sidebar) cho admin ở đây */}
          <h2>Admin Menu</h2>
          <ul>
            <li>Dashboard</li>
            <li>Statistics</li>
            <li><a href="/">Về trang chủ</a></li>
          </ul>
        </aside>
        <main style={{ flex: 1, padding: '1rem' }}>
          {/* {children} (ví dụ: trang dashboard) sẽ được hiển thị
              NẾU "Gác cổng" cho phép */}
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
