import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, password } = await req.json();

  const be = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const res = await fetch(`${be}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.token) {
    return NextResponse.json(data || { message: 'Login failed route.js' }, { status: res.status || 401 });
  }

  const cookieName = process.env.SESSION_COOKIE_NAME || 'token';
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set(cookieName, data.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    //maxAge: 60 * 60, // 1h
    // secure: true, // bật khi deploy HTTPS
  });
  return resp;
}