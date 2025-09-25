import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("mysecret");

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Nếu vào dashboard => check token
  if (pathname.startsWith("/admin123/dashboard")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin123/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin123/login", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/admin123/login", req.url));
    }
  }

  // Nếu gõ /admin123 thì auto redirect sang login
  if (pathname === "/admin123") {
    return NextResponse.redirect(new URL("/admin123/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin123/:path*"],
};