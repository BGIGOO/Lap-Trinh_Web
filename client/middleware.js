import { NextResponse } from 'next/server';

const COOKIE = process.env.SESSION_COOKIE_NAME || 'token';
const PROTECTED_PREFIXES = ['/admin123', '/employee123'];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  // bỏ qua tài nguyên tĩnh và API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // nếu truy cập khu admin/employee mà không có cookie -> chuyển về trang login tương ứng
  if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    const hasToken = !!req.cookies.get(COOKIE)?.value;
    if (!hasToken) {
      const loginPath = pathname.startsWith('/admin123') ? '/admin123/login' : '/employee123/login';
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};