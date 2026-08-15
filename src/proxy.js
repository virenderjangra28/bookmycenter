import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

function normalizeRole(role) {
  if (role === 1 || role === "1") return "1";
  if (role === 2 || role === "2") return "2";
  return "";
}

async function getAuthPayload(request) {
  const token = request.cookies.get("token")?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const payload = await getAuthPayload(request);
  const role = normalizeRole(payload?.role);

  if (!payload || !role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && role !== "1") {
    return NextResponse.redirect(new URL("/client/dashboard", request.url));
  }

  if (pathname.startsWith("/client") && role !== "2") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
