import { httpClient } from "@/shared/api/http-client";

export const logoutApi = {
  logout: () =>
    httpClient<void>("/admin/auth/logout", { method: "POST" }),
};
