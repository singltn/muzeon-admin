import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/verify-2fa"];

// Возможные имена куки сессии от бэкенда (settings.SESSION_COOKIE)
const SESSION_COOKIE_NAMES = ["session_id", "session", "admin_session"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // На одном домене бэкенд сам ставит HttpOnly куку — читаем её напрямую
  const hasSession = SESSION_COOKIE_NAMES.some(
    (name) => !!request.cookies.get(name)?.value,
  );

  if (!isPublic && !hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
