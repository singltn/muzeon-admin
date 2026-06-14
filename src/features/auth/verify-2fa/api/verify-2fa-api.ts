import { httpClient } from "@/shared/api/http-client";

export const verify2faApi = {
  verify: (body: { email: string; otp: string }) =>
    httpClient<void>("/admin/auth/verify", { method: "POST", body }),
};
