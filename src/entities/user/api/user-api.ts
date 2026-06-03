import { httpClient } from "@/shared/api/http-client";
import type { User } from "../model/types";
import type { PaginatedResponse } from "@/shared/api/types";

export const userApi = {
  me: () => httpClient<User>("/auth/me"),
  list: (params: { page?: number; search?: string }) =>
    httpClient<PaginatedResponse<User>>("/users", { params }),
};
