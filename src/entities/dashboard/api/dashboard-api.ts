import { httpClient } from "@/shared/api/http-client";
import type { DashboardResponse } from "../model/types";

export const dashboardApi = {
  get: () => httpClient<DashboardResponse>("/admin/dashboard"),
};

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
};
