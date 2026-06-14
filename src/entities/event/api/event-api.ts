import { httpClient } from "@/shared/api/http-client";
import type { Event, EventCreate, EventUpdate } from "../model/types";
import type { ListResponse } from "@/shared/api/types";

export const eventApi = {
  list: (museumId: number, params?: { offset?: number; limit?: number }) =>
    httpClient<ListResponse<Event>>(`/museums/${museumId}/events`, {
      params: params as Record<string, number>,
    }),

  byId: (museumId: number, eventId: number) =>
    httpClient<Event>(`/museums/${museumId}/events/${eventId}`),

  create: (museumId: number, body: EventCreate) =>
    httpClient<Event>(`/museums/${museumId}/events`, { method: "POST", body }),

  update: (museumId: number, eventId: number, body: EventUpdate) =>
    httpClient<Event>(`/museums/${museumId}/events/${eventId}`, {
      method: "PATCH",
      body,
    }),

  remove: (museumId: number, eventId: number) =>
    httpClient<void>(`/museums/${museumId}/events/${eventId}`, {
      method: "DELETE",
    }),
};
