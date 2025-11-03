'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation'; // 1. Import 'usePathname'

// Giả sử vai trò của bạn: 1: Admin, 2: Employee, 3: Client
// Chúng ta sẽ cho phép Admin (1) và Employee (2) vào
const ADMIN_ROLES = [1, 2];

// Component "Gác cổng"
export default function AdminAuthGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // 2. Lấy đường dẫn hiện tại
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // 3. Định nghĩa đường dẫn trang login
    const loginPath = '/admin123/login';

    // 4. (LOGIC MỚI) Nếu là trang login, cho phép render ngay
    if (pathname === loginPath) {
      setIsAllowed(true);
      return;
    }

    // --- Logic bảo vệ (chỉ chạy cho các trang không phải login) ---
    if (isLoading) {
      // 1. Đang tải (chờ AuthContext kiểm tra token F5)
      //    Chưa quyết định, cứ chờ
      return;
    }

    if (!user) {
      // 2. Tải xong, không có user -> Đẩy về login
      router.replace(loginPath);
      return;
    }

    // 3. Tải xong, có user -> Kiểm tra vai trò (role)
    if (ADMIN_ROLES.includes(user.role)) {
      // 3a. Hợp lệ -> Cho phép render trang
      setIsAllowed(true);
    } else {
      // 3b. Không hợp lệ (ví dụ: role là 3 - Client)
      //     Đẩy về trang "Không có quyền" (hoặc tạm thời về login)
      console.warn('Truy cập bị từ chối: Vai trò không hợp lệ.');
      router.replace(loginPath); // Hoặc '/unauthorized'
    }

  }, [user, isLoading, router, pathname]); // 5. Thêm 'pathname' vào dependencies

  // Trong khi chờ (isLoading=true) hoặc chờ redirect (isAllowed=false),
  // hiển thị màn hình loading để tránh "nháy" (flicker)
  // (Chúng ta thêm 'pathname' vào điều kiện để trang login không bị loading)
  if (!isAllowed && pathname !== '/admin123/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải và xác thực...</p>
        {/* Bạn có thể thêm Spinner (biểu tượng quay) ở đây */}
      </div>
    );
  }

  // 4. Mọi thứ OK -> Hiển thị trang
  return <>{children}</>;
}

