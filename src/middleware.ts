import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/verify-2fa"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  // API cookie (session_id) устанавливается на домен API, а не на домен фронта.
  // Вместо него проверяем session_marker — лёгкую куку, которую фронт ставит
  // сам после успешного 2FA. Реальная авторизация проверяется через API HttpOnly cookie.
  const sessionCookie =
    request.cookies.get("session_marker")?.value ??
    request.cookies.get("session_id")?.value ??
    request.cookies.get("session")?.value;

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
    "/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
