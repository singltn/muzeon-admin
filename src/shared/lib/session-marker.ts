/** 
 * Маркер сессии на домене фронта. 
 * Middleware не может видеть HttpOnly cookie от стороннего API, 
 * поэтому мы выставляем этот маркер после успешного 2FA. 
 * Реальная авторизация проверяется через API cookie на каждый запрос.
 */

const COOKIE_NAME = "session_marker";

export function setSessionMarker() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=1; path=/; SameSite=Lax; max-age=86400`;
}

export function clearSessionMarker() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
