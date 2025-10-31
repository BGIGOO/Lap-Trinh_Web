import { NextResponse } from 'next/server';

export async function POST(req) {
  // 1. Lấy username, password từ request của component AdminLoginPage
  const { username, password } = await req.json();

  // 2. Gọi đến backend "thật" (ví dụ: http://localhost:5000)
  const be = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const res = await fetch(`${be}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  // 3. Xử lý nếu backend "thật" trả về lỗi
  if (!res.ok || !data?.token) {
    // Trả về JSON có chứa 'message'
    // Điều này PHÙ HỢP với component AdminLoginPage vì nó đang chờ 'd?.message'
    return NextResponse.json(
      data || { message: 'Login failed route.js' },
      { status: res.status || 401 }
    );
  }

  // 4. Xử lý nếu đăng nhập thành công
  const cookieName = process.env.SESSION_COOKIE_NAME || 'token';
  
  // Trả về { ok: true }
  // Điều này PHÙ HỢP với AdminLoginPage vì nó sẽ vượt qua 'if (!res.ok)'
  const resp = NextResponse.json({ ok: true });

  // Quan trọng nhất: Set token vào httpOnly cookie
  // Component AdminLoginPage không cần đọc cookie, nó chỉ cần biết là OK
  // và thực hiện chuyển hướng.
  resp.cookies.set(cookieName, data.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    //maxAge: 60 * 60, // 1h
    // secure: true, // bật khi deploy HTTPS
  });
  
  return resp;
}
