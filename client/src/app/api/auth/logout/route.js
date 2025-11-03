import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BE_API_URL = process.env.BE_API_URL;

/**
 * @desc    "Proxy" API đăng xuất
 * Lấy 'refreshToken' từ cookie (Client -> Next.js),
 * gửi nó đến BE (để BE xóa trong DB),
 * và "chuyển tiếp" cookie đã hết hạn từ BE về Client.
 */
export async function POST(req) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Nếu không có token, coi như đã đăng xuất
  if (!refreshToken) {
    return NextResponse.json({ message: 'Đã đăng xuất' }, { status: 200 });
  }

  try {
    // 1. Gọi BE để vô hiệu hóa token trong DB
    const res = await fetch(`${BE_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${refreshToken}`
      }
    });

    const data = await res.json();

    // 2. (QUAN TRỌNG) Lấy 'Set-Cookie' (đã hết hạn) từ BE
    const cookie = res.headers.get('Set-Cookie');
    
    // 3. Tạo response trả về cho Client
    const response = NextResponse.json(data);

    // 4. (QUAN TRỌNG) Gắn cookie hết hạn này vào response
    //    để trình duyệt Client xóa nó đi
    if (cookie) {
      response.headers.set('Set-Cookie', cookie);
    }

    return response;

  } catch (error) {
    console.error('Lỗi proxy đăng xuất:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}

