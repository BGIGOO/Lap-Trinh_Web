'use client';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  // Không cần check null ở đây, AuthGuard sẽ lo
  return (
    <AuthGuard allowedRoles={[1]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Hello, đây là Dashboard</h1>

        {user && (
          <div className="space-y-1">
            <p>
              Chào mừng, <strong>{user.name}</strong>!
            </p>
            <p>Role của bạn: {user.role}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </AuthGuard>
  );
}