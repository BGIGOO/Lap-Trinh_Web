import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

export async function POST(req) { // <--- 'req' là tham số quan trọng
  try {
    // 1. (ĐÃ SỬA) Lấy cookie trực tiếp từ 'req'
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Không tìm thấy refresh token' },
        { status: 401 }
      );
    }

    // 2. Gọi đến BE Express, gửi 'refreshToken' trong 'Cookie' header
    const res = await fetch(`${BE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${refreshToken}`
      }
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy làm mới token:', error);
    // Nếu lỗi (ví dụ: cookie sai), BE sẽ trả về 403,
    // nhưng nếu code sập, chúng ta trả về 500
    if (error.name === 'TypeError') {
      return NextResponse.json({ message: 'Lỗi cú pháp cookie.' }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}

