'use client';
import { useAuth } from '@/context/AuthContext';
import UnauthorizedPage from '@/components/UnauthorizedPage';

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
    return <div>Đang khôi phục phiên làm việc…</div>;
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
