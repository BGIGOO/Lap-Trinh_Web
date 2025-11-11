'use client';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage({ message }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 border max-w-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-3">Không có quyền truy cập</h1>
        <p className="text-gray-700 mb-6">
          {message || 'Bạn không có quyền truy cập vào trang này hoặc hành động này.'}
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-all"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
