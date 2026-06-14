import { toast } from "sonner";
import { ApiError } from "@/shared/api/http-client";

const API_ERROR_MESSAGES: Record<string, string> = {
  AUTH_REQUIRED: "Необходима авторизация",
  SESSION_EXPIRED: "Сессия истекла",
  PERMISSION_DENIED: "Недостаточно прав",
  NOT_FOUND: "Ресурс не найден",
  USER_NOT_FOUND: "Пользователь не найден",
  CONFLICT: "Запись уже существует",
  INVALID_OTP: "Неверный код подтверждения",
  INVALID_CREDENTIALS: "Неверные данные для входа",
  BAD_REQUEST: "Некорректный запрос",
};

export function toastApiError(error: unknown) {
  if (error instanceof ApiError) {
    const message =
      API_ERROR_MESSAGES[error.code] ??
      error.message ??
      "Произошла ошибка";
    toast.error(message);
  } else {
    toast.error("Произошла непредвиденная ошибка");
  }
}

export function toastSuccess(message: string) {
  toast.success(message);
}
