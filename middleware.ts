import { NextRequest, NextResponse } from "next/server";

const PRIVATE_OR_SYSTEM_PREFIXES = ["/api", "/admin", "/portal", "/auth", "/_next"];
const PUBLIC_FILES = /\.[a-zA-Z0-9]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILES.test(pathname) || PRIVATE_OR_SYSTEM_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (pathname === "/portal/register" || pathname.startsWith("/portal/register/")) {
      const holdUrl = request.nextUrl.clone();
      holdUrl.pathname = "/en";
      holdUrl.search = "?applications=paused";
      holdUrl.hash = "company";
      return NextResponse.redirect(holdUrl, 307);
    }
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "/en") return NextResponse.next();

  const holdUrl = request.nextUrl.clone();
  holdUrl.pathname = "/en";
  holdUrl.search = "";
  holdUrl.hash = "";
  return NextResponse.redirect(holdUrl, 307);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
