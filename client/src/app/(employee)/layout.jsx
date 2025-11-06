'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard'; // dùng file mới ở trên

export default function AdminLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[1]}>
      <div className="admin-container">
        <aside>
          <h2>Admin Menu</h2>
          {/* ... */}
        </aside>
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}