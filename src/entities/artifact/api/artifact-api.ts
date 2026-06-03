import { httpClient } from "@/shared/api/http-client";
import type { PaginatedResponse } from "@/shared/api/types";
import type { Artifact } from "../model/types";

export const artifactApi = {
  list: (params: { page?: number; search?: string; exhibitionId?: string }) =>
    httpClient<PaginatedResponse<Artifact>>("/artifacts", { params }),
  byId: (id: string) => httpClient<Artifact>(`/artifacts/${id}`),
};
