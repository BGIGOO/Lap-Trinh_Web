import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

// HÀM PATCH (CẦN CÓ)
export async function PATCH(req) {
  try {
    // 1. Lấy Authorization header từ client
    const authHeader = req.headers.get('Authorization');
    // 2. Lấy body (old_password, new_password)
    const body = await req.json();

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Thiếu Authorization header' },
        { status: 401 }
      );
    }

    // 3. Gọi đến BE Express (đúng endpoint /users/me/password)
    const res = await fetch(`${BE_API_URL}/users/me/password`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader, // Chuyển tiếp token
        'Content-Type': 'application/json' // Báo cho BE biết đây là JSON
      },
      body: JSON.stringify(body) // Gửi body đi
    });

    // Logic parse JSON an toàn
    const textBody = await res.text();
    let data;
    try {
      data = textBody ? JSON.parse(textBody) : {}; // Trả về {} nếu rỗng
    } catch (e) {
      console.error('Lỗi parse JSON từ PATCH /me/password BE:', textBody);
      return NextResponse.json({ message: 'Phản hồi không hợp lệ từ BE' }, { status: 500 });
    }
    
    // 4. Trả kết quả (JSON) về cho client
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy PATCH /me/password:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}