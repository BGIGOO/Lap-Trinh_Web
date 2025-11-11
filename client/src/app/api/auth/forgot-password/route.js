import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

export async function POST(req) {
  try {
    const body = await req.json(); // { email: "..." }

    // Đây là public route, KHÔNG cần Authorization header
    const res = await fetch(`${BE_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const textBody = await res.text();
    const data = textBody ? JSON.parse(textBody) : {};

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy POST /auth/forgot-password:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
  }
}