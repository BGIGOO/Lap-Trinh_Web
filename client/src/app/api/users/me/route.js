import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

export async function GET(req) { // <--- 'req' là tham số quan trọng
  try {
    // 1. (ĐÃ SỬA) Lấy header trực tiếp từ 'req'
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Thiếu Authorization header' },
        { status: 401 }
      );
    }

    // 2. Gọi đến BE Express, đính kèm 'Authorization' header
    const res = await fetch(`${BE_API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader // Chuyển tiếp token
      }
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy /me:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}
