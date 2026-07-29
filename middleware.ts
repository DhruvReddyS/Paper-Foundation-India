import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const configured = Boolean(process.env.MONGODB_URI && process.env.NEXTAUTH_SECRET);
  const previewEnabled = process.env.NODE_ENV !== "production" &&
    (process.env.ADMIN_PREVIEW_MODE === "true" || !configured);
  if (previewEnabled) return NextResponse.next();
  if (!configured) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("setup", "required");
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token?.sub) return NextResponse.next();
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*"] };
