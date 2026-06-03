import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware: cookie presence check only.
 * Full session/role validation happens in layouts via API + Redux hydrate.
 */
const PUBLIC_PATHS = ["/login", "/verify-2fa"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const sessionCookie = request.cookies.get("session")?.value;

  if (!isPublic && !sessionCookie) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  if (isPublic && sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Не трогаем статику из /public (картинки, шрифты и т.д.) —
     * иначе auth-bg.jpg редиректится на /login и фон не грузится.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
