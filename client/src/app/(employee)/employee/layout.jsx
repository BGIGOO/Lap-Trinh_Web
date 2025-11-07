'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard'; // dùng file mới ở trên

export default function EmployeeLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[2]}>
      <div className="admin-container">
        <aside>
          <h2>em Menu</h2>
          {/* ... */}
        </aside>
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}