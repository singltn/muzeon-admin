import { httpClient } from "@/shared/api/http-client";
import type { User, AdminUserCreate, AdminUserUpdate } from "../model/types";
import type { ListResponse } from "@/shared/api/types";

export const userApi = {
  me: () => httpClient<User>("/admin/users/me"),

  list: (museumId: number, params?: { offset?: number; limit?: number }) =>
    httpClient<ListResponse<User>>(`/museums/${museumId}/users`, { params: params as Record<string, number> }),

  byId: (museumId: number, userId: number) =>
    httpClient<User>(`/museums/${museumId}/users/${userId}`),

  create: (museumId: number, body: AdminUserCreate) =>
    httpClient<User>(`/museums/${museumId}/users`, { method: "POST", body }),

  update: (museumId: number, userId: number, body: AdminUserUpdate) =>
    httpClient<User>(`/museums/${museumId}/users/${userId}`, { method: "PATCH", body }),

  remove: (museumId: number, userId: number) =>
    httpClient<void>(`/museums/${museumId}/users/${userId}`, { method: "DELETE" }),
};
