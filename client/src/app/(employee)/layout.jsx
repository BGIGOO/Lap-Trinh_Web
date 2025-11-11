'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard'; // dùng file mới ở trên

export default function AdminLayout({ children }) {
  return (
    <AuthGuard allowedRoles={[2]}>
      <div className="employ-container">
        <aside>
        </aside>
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}