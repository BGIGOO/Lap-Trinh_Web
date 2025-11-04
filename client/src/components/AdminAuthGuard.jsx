'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ allowedRoles, children }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // (Chúng ta không cần state 'isVerified' nữa
  // vì 'isLoading' của Context đã đủ tin cậy)

  useEffect(() => {
    const checkAuth = async () => {
      // [SỬA LỖI TREO]
      // Nếu là trang login, KHÔNG làm gì cả
      if (pathname === '/admin123/login') {
        return;
      }
      
      // Nếu là trang admin khác, và chưa có user (F5)
      // thì mới gọi refresh
      if (!auth.user) {
        await auth.refreshAndLoadUser(); 
      }
    };

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Chỉ chạy lại khi đổi trang

  // [SỬA LỖI TREO]
  // 1. Nếu là trang login, cho qua luôn
  if (pathname === '/admin123/login') {
    return <>{children}</>;
  }

  // 2. Nếu là trang admin khác VÀ đang loading
  if (auth.isLoading) {
    return <div>Đang tải và xác thực...</div>;
  }

  // 3. Nếu đã hết loading, VẪN không có user (bị F5 khi token hết hạn)
  if (!auth.user) {
    // Middleware V1 (middleware.js) đã xử lý việc này,
    // nhưng đây là chốt Vòng 2.
    // Chúng ta không redirect ở đây nữa, vì middleware đã làm.
    // Thay vào đó, chúng ta chỉ không render gì cả.
    console.error("AuthGuard: Không có user (đã bị middleware chặn).");
    // (Nếu middleware của bạn chạy đúng, code sẽ không bao giờ tới đây)
    return <div>Đang tải và xác thực...</div>; // Vẫn loading
  }
  
  // 4. Nếu có user, nhưng role không được phép
  if (!allowedRoles.includes(auth.user.role)) {
    console.error(`AuthGuard: Role (${auth.user.role}) không được phép.`);
    router.replace('/'); // Về trang chủ
    return <div>Bạn không có quyền truy cập...</div>;
  }

  // 5. Mọi thứ OK
  return <>{children}</>;
}

