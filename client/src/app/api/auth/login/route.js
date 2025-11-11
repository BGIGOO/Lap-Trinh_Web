import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

/**
 * @desc    "Proxy" API đăng nhập
 * Nhận request từ Client (trang Login),
 * gửi đến BE Express,
 * và quan trọng nhất: "chuyển tiếp" httpOnly cookie từ BE về Client.
 */
export async function POST(req) {
  const body = await req.json();

  try {
    // 1. Gọi đến BE Express
    const res = await fetch(`${BE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // 2. Kiểm tra nếu BE trả về lỗi (ví dụ: sai mật khẩu)
    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Đăng nhập thất bại' },
        { status: res.status }
      );
    }

    // 3. (QUAN TRỌNG) Lấy 'Set-Cookie' header từ BE
    const cookie = res.headers.get('Set-Cookie');

    // 4. Tạo response trả về cho Client
    //    (data ở đây là { accessToken, user })
    const response = NextResponse.json(data);

    // 5. (QUAN TRỌNG) Gắn httpOnly cookie vào response này
    if (cookie) {
      response.headers.set('Set-Cookie', cookie);
    }

    return response;

  } catch (error) {
    console.error('Lỗi proxy đăng nhập:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}

