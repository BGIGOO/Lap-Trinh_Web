'use client';
import { useAuth } from '@/context/AuthContext';
import UnauthorizedPage from '@/components/UnauthorizedPage';
import { Loader2 } from 'lucide-react'; // 1. Thêm import icon

export default function AuthGuard({ children, allowedRoles, error }) {
  const { user, isBootstrapping, lastAuthError } = useAuth();

  // Nếu trang con báo 403 khi tự gọi API riêng
  if (error?.unauthorized) {
    return <UnauthorizedPage />;
  }

  // Nếu bootstrap (silent refresh) gặp 403 ở /users/me → hiện trang không có quyền
  if (lastAuthError === 'unauthorized') {
    return <UnauthorizedPage />;
  }

  // Chờ silent refresh sau F5
  if (typeof isBootstrapping !== 'undefined' && isBootstrapping) {
    // 2. Thay thế div này
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#f2f7f5]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00473e]" />
          <p className="text-lg font-medium text-[#475d5b]">
            Đang tải…
          </p>
        </div>
      </div>
    );
  }

  // (Tuỳ chọn) UI guard nhẹ theo role
  if (user && typeof allowedRoles !== 'undefined') {
    const allow = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!allow.includes(Number(user.role))) {
      return <UnauthorizedPage />;
    }
  }

  return <>{children}</>;
}