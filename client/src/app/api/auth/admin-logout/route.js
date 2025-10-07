import { NextResponse } from 'next/server';

export async function POST() {
  const name = process.env.SESSION_COOKIE_NAME || 'token';
  const res = NextResponse.json({ ok: true });
  res.cookies.set(name, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}