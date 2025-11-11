import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

// HÀM GET (Lấy danh sách khách hàng, hỗ trợ filter/sort/pagination)
export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Thiếu Authorization header' }, { status: 401 });
    }

    // Lấy toàn bộ query params
    const { search } = new URL(req.url);

    // Gọi đến BE, chuyển tiếp token VÀ query params
    const res = await fetch(`${BE_API_URL}/users/customers${search}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });

    // Logic parse JSON an toàn
    const textBody = await res.text();
    let data;
    try {
      data = textBody ? JSON.parse(textBody) : {};
    } catch (e) {
      console.error('Lỗi parse JSON từ GET /users/customers BE:', textBody);
      return NextResponse.json({ message: 'Phản hồi không hợp lệ từ BE' }, { status: 500 });
    }

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy GET /users/customers:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
  }
}