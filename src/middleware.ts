import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/brand-profile", "/processing", "/dashboard", "/calendar", "/settings", "/brand-kit"];
const AUTH_ONLY = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("dc_session");
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  const isAuthOnly = AUTH_ONLY.includes(pathname);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthOnly && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/brand-profile", "/processing", "/dashboard", "/calendar", "/settings", "/brand-kit", "/login", "/signup"],
};
