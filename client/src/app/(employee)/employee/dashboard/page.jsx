'use client';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/context/AuthContext';

export default function EmployeeDashboardPage() {
  const { user, logout } = useAuth();
  return (
    <AuthGuard allowedRoles={[2]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Hello, đây là Dashboard em</h1>
        {user && <p>Chào mừng, <strong>{user.name}</strong>!</p>}
        <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Đăng xuất</button>
      </div>
    </AuthGuard>
  );
}
