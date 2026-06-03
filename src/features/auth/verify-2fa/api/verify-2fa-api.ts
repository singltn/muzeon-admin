import { httpClient } from "@/shared/api/http-client";

export const verify2faApi = {
  verify: (body: { challengeId: string; code: string }) =>
    httpClient<{ status: "authenticated" }>("/auth/2fa/verify", {
      method: "POST",
      body,
    }),
};
