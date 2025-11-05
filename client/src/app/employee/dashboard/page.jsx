'use client'; // Cần 'use client' để dùng hook

import { useAuth } from '@/context/AuthContext'; // 1. Import "bộ não"

export default function DashboardPage() {
  
  // 2. Lấy thông tin user và hàm logout từ "bộ não"
  const { user, logout } = useAuth();

  // (Component "Gác cổng" đã đảm bảo 'user' không thể là null ở đây)
  
  return (
    <div>
      <h1>Hello, đây là Dashboard employ</h1>
      
      {/* 3. Hiển thị thông tin user đã đăng nhập */}
      {user && (
        <div>
          <p>Chào mừng, <strong>{user.name}</strong>!</p>
          <p>Role của bạn: {user.role}</p>
        </div>
      )}
      
      {/* 4. Thêm nút Logout */}
      <button 
        onClick={logout} 
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Đăng xuất
      </button>
    </div>
  );
}
