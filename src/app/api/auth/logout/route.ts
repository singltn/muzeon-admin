import { NextResponse, type NextRequest } from "next/server";

const BACKEND =
  (process.env.API_BACKEND_URL ?? "http://31.76.6.214:8080/api/v1").replace(/\/$/, "");

/**
 * Серверный logout:
 * 1. Удаляем session_marker cookie (надёжно, без race condition)
 * 2. Пытаемся сообщить бэкенду (best-effort, не блокируем если упадёт)
 * 3. Редиректим на /login
 */
export async function POST(request: NextRequest) {
  // Пробуем вызвать бэкенд, передав его собственные куки (если они есть в запросе)
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    await fetch(`${BACKEND}/admin/auth/logout`, {
      method: "POST",
      headers: { cookie: cookieHeader },
    });
  } catch {
    // игнорируем — главное очистить маркер и перейти на логин
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  // Удаляем session_marker до того как браузер сделает следующий запрос
  response.cookies.delete("session_marker");
  // На случай если session_id всё-таки есть на домене фронта
  response.cookies.delete("session_id");
  response.cookies.delete("session");

  return response;
}
