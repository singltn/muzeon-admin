import { httpClient } from "@/shared/api/http-client";

/** Бэкенд всегда отправляет OTP на email и возвращает 200 */
export type LoginResponse = {
  message?: string;
  detail?: string;
};

export const loginApi = {
  login: (body: { email: string; password: string }) =>
    httpClient<LoginResponse>("/admin/auth/login", { method: "POST", body }),
};
