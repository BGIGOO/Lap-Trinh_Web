import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Lấy refreshToken từ cookie (httpOnly)
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // ====== ADMIN ZONE ======
  if (pathname.startsWith('/admin123')) {
    // Nếu không có token mà không phải đang ở trang login
    if (!refreshToken && pathname !== '/admin123/login') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin123/login';
      return NextResponse.redirect(url);
    }

    // Nếu đã có token mà cố truy cập lại trang login
    if (refreshToken && pathname === '/admin123/login') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin123/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // ====== EMPLOYEE ZONE ======
  if (pathname.startsWith('/employee')) {
    if (!refreshToken && pathname !== '/employee/login') {
      const url = req.nextUrl.clone();
      url.pathname = '/employee/login';
      return NextResponse.redirect(url);
    }

    if (refreshToken && pathname === '/employee/login') {
      const url = req.nextUrl.clone();
      url.pathname = '/employee/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Các route khác (public) → cho qua
  return NextResponse.next();
}

// Middleware này chỉ chạy với các đường dẫn sau
export const config = {
  matcher: [
    '/admin123/:path*',
    '/employee/:path*',
  ],
};
