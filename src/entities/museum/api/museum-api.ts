import { httpClient } from "@/shared/api/http-client";
import type { Museum, MuseumCreate, MuseumUpdate } from "../model/types";
import type { ListResponse } from "@/shared/api/types";

export const museumApi = {
  list: (params?: { offset?: number; limit?: number }) =>
    httpClient<ListResponse<Museum>>("/museums", { params: params as Record<string, number> }),

  byId: (id: number) => httpClient<Museum>(`/museums/${id}`),

  create: (body: MuseumCreate) =>
    httpClient<Museum>("/museums", { method: "POST", body }),

  update: (id: number, body: MuseumUpdate) =>
    httpClient<Museum>(`/museums/${id}`, { method: "PATCH", body }),
};
