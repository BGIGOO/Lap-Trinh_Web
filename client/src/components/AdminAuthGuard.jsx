'use client';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children, error }) {
  const { logout } = useAuth();

  if (error?.unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-600 mb-4">
          Bạn không có quyền truy cập trang này.
        </p>
        <button
          onClick={logout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return <>{children}</>;
}