import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

// HÀM PUT (Admin cập nhật profile của người khác)
export async function PUT(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    const body = await req.json(); // Lấy nội dung từ client (sẽ chứa "id" của user)

    if (!authHeader) {
      return NextResponse.json({ message: 'Thiếu Authorization header' }, { status: 401 });
    }

    // Gọi đến BE, chuyển tiếp token VÀ body
    const res = await fetch(`${BE_API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // Logic parse JSON an toàn
    const textBody = await res.text();
    let data;
    try {
      data = textBody ? JSON.parse(textBody) : {};
    } catch (e) {
      console.error('Lỗi parse JSON từ PUT /users/profile BE:', textBody);
      return NextResponse.json({ message: 'Phản hồi không hợp lệ từ BE' }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy PUT /users/profile:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
  }
}