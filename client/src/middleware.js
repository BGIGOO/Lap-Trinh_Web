// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   // Log sẽ xuất hiện trên TERMINAL, không phải F12 của trình duyệt
//   console.log('[MW] trong');

//   // const pathname = req.nextUrl.pathname;

//   // cho qua tài nguyên tĩnh & API (tránh tự chặn /api)
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     pathname === '/favicon.ico'
//   ) {
//     return NextResponse.next();
//   }

//   // cho phép trang login
//   if (pathname === '/admin123/login' || pathname === '/employee/login') {
//     return NextResponse.next();
//   }

//   // bảo vệ khu /admin123 và /employee123
//   if (pathname.startsWith('/admin123') || pathname.startsWith('/employee')) {
//     const token = req.cookies.get(process.env.SESSION_COOKIE_NAME || 'token')?.value;
//     if (!token) {
//       const login = pathname.startsWith('/admin123') ? '/admin123/login' : '/employee/login';
//       return NextResponse.redirect(new URL(login, req.url));
//     }
//   }

//   return NextResponse.next();
// }

// // TẠM THỜI bỏ matcher để Next áp dụng middleware cho mọi request (trừ phần ta cho qua ở trên)
// // export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
