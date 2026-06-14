import { httpClient } from "@/shared/api/http-client";
import type { EventLocation, EventLocationCreate, EventLocationUpdate } from "../model/types";
import type { ListResponse } from "@/shared/api/types";

export const locationApi = {
  list: (museumId: number, params?: { offset?: number; limit?: number }) =>
    httpClient<ListResponse<EventLocation>>(`/museums/${museumId}/event-locations`, {
      params: params as Record<string, number>,
    }),

  byId: (museumId: number, locationId: number) =>
    httpClient<EventLocation>(`/museums/${museumId}/event-locations/${locationId}`),

  create: (museumId: number, body: EventLocationCreate) =>
    httpClient<EventLocation>(`/museums/${museumId}/event-locations`, {
      method: "POST",
      body,
    }),

  update: (museumId: number, locationId: number, body: EventLocationUpdate) =>
    httpClient<EventLocation>(`/museums/${museumId}/event-locations/${locationId}`, {
      method: "PATCH",
      body,
    }),

  remove: (museumId: number, locationId: number) =>
    httpClient<void>(`/museums/${museumId}/event-locations/${locationId}`, {
      method: "DELETE",
    }),
};
