import { httpClient } from "@/shared/api/http-client";

export const logoutApi = {
  logout: () => httpClient<void>("/auth/logout", { method: "POST" }),
};
