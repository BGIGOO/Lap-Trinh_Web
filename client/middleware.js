import { NextResponse } from 'next/server';

export async function middleware() {
  // Không cần check gì cả, chỉ cho phép Next xử lý
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin123/:path*', '/employee/:path*'],
};