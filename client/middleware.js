import { NextResponse } from 'next/server';

// (Đây là file server-side, nó chạy trên Edge)

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Lấy refreshToken (cách duy nhất middleware có thể đọc httpOnly cookie)
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // === Kịch bản 1: Bảo vệ khu vực Admin
  if (pathname.startsWith('/admin123')) {
    if (!refreshToken) {
      // Nếu vào /admin123/* MÀ KHÔNG CÓ token,
      // redirect về trang login, TRỪ KHI đã ở trang login
      if (pathname !== '/admin123/login') {
        const url = req.nextUrl.clone();
        url.pathname = '/admin123/login';
        return NextResponse.redirect(url);
      }
    } else {
      // Nếu có token MÀ VẪN vào trang login (ví dụ: bookmark)
      // đá họ về dashboard
      if (pathname === '/admin123/login') {
         const url = req.nextUrl.clone();
         url.pathname = '/admin123/dashboard';
         return NextResponse.redirect(url);
      }
    }
  }

  // === Kịch bản 2: Bảo vệ khu vực Employee
  if (pathname.startsWith('/employee')) {
     if (!refreshToken) {
        if (pathname !== '/employee/login') { // (Giả sử bạn sẽ tạo trang này)
          const url = req.nextUrl.clone();
          url.pathname = '/employee/login';
          return NextResponse.redirect(url);
        }
     } else {
        if (pathname === '/employee/login') {
           const url = req.nextUrl.clone();
           url.pathname = '/employee/dashboard'; // (Giả sử)
           return NextResponse.redirect(url);
        }
     }
  }

  // === Kịch bản 3: Public (Trang chủ, Gà rán...)
  // Không làm gì cả, cho qua
  return NextResponse.next();
}

// Chỉ định các đường dẫn mà middleware này sẽ chạy
export const config = {
  matcher: [
    '/admin123/:path*', // Tất cả các trang admin
    '/employee/:path*', // Tất cả các trang employee
    '/', // Trang chủ (để nó chạy Kịch bản 3)
    '/product/:path*', // Trang sản phẩm (Kịch bản 3)
    // (Thêm các trang public khác của bạn vào đây)
  ],
};
