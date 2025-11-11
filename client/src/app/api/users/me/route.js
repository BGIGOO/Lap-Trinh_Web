import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

// HÀM GET (ĐÃ CÓ)
export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Thiếu Authorization header' },
        { status: 401 }
      );
    }

    const res = await fetch(`${BE_API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });

    // Logic parse JSON an toàn
    const textBody = await res.text();
    let data;
    try {
      data = textBody ? JSON.parse(textBody) : {}; // Trả về {} nếu rỗng
    } catch (e) {
      console.error('Lỗi parse JSON từ GET /users/me BE:', textBody);
      return NextResponse.json({ message: 'Phản hồi không hợp lệ từ BE' }, { status: 500 });
    }

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy GET /me:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}

// HÀM PUT (CẦN THÊM)
export async function PUT(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    const body = await req.json(); // Lấy nội dung từ client

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Thiếu Authorization header' },
        { status: 401 }
      );
    }

    // 2. Gọi đến BE Express, đính kèm 'Authorization' header VÀ body
    const res = await fetch(`${BE_API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader, // Chuyển tiếp token
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body) // Chuyển tiếp body
    });

    // Logic parse JSON an toàn
    const textBody = await res.text();
    let data;
    try {
      data = textBody ? JSON.parse(textBody) : {}; // Trả về {} nếu rỗng
    } catch (e) {
      console.error('Lỗi parse JSON từ PUT /users/me BE:', textBody);
      return NextResponse.json({ message: 'Phản hồi không hợp lệ từ BE' }, { status: 500 });
    }
    
    // 3. Trả kết quả (JSON) về cho client
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy PUT /me:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}