import { httpClient } from "@/shared/api/http-client";
import type { Session } from "../model/types";
import type { ListResponse } from "@/shared/api/types";

export const sessionApi = {
  list: (params?: { offset?: number; limit?: number }) =>
    httpClient<ListResponse<Session>>("/admin/sessions", {
      params: params as Record<string, number>,
    }),

  remove: (sessionId: string) =>
    httpClient<void>(`/admin/sessions/${sessionId}`, { method: "DELETE" }),

  logout: () =>
    httpClient<void>("/admin/auth/logout", { method: "POST" }),
};
