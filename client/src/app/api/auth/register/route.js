import { NextResponse } from 'next/server';

const BE_API_URL = process.env.BE_API_URL;

/**
 * @desc    "Proxy" API đăng ký
 * API này đơn giản là chuyển tiếp request và response.
 */
export async function POST(req) {
  const body = await req.json();

  try {
    const res = await fetch(`${BE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Chuyển tiếp response (thành công hoặc lỗi) từ BE về Client
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error('Lỗi proxy đăng ký:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống, không thể kết nối đến BE.' },
      { status: 500 }
    );
  }
}

