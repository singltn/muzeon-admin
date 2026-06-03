import { httpClient } from "@/shared/api/http-client";

export type LoginResponse =
  | { status: "authenticated" }
  | { status: "2fa_required"; challengeId: string };

export const loginApi = {
  login: (body: { email: string; password: string }) =>
    httpClient<LoginResponse>("/auth/login", { method: "POST", body }),
};
