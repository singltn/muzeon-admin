import { httpClient } from "@/shared/api/http-client";
import type { PaginatedResponse } from "@/shared/api/types";
import type { Exhibition } from "../model/types";
import type { ExhibitionFormValues } from "../model/schemas";

export const exhibitionApi = {
  list: (params: { page?: number; status?: string; search?: string }) =>
    httpClient<PaginatedResponse<Exhibition>>("/exhibitions", { params }),
  byId: (id: string) => httpClient<Exhibition>(`/exhibitions/${id}`),
  create: (body: ExhibitionFormValues) =>
    httpClient<Exhibition>("/exhibitions", { method: "POST", body }),
  update: (id: string, body: Partial<ExhibitionFormValues>) =>
    httpClient<Exhibition>(`/exhibitions/${id}`, { method: "PATCH", body }),
  remove: (id: string) =>
    httpClient<void>(`/exhibitions/${id}`, { method: "DELETE" }),
};
