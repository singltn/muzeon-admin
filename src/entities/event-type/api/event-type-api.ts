import { httpClient } from "@/shared/api/http-client";
import type { EventType, EventTypeCreate, EventTypeUpdate } from "../model/types";

export const eventTypeApi = {
  list: () => httpClient<EventType[]>("/event-types"),
  byId: (id: number) => httpClient<EventType>(`/event-types/${id}`),
  create: (body: EventTypeCreate) =>
    httpClient<EventType>("/event-types", { method: "POST", body }),
  update: (id: number, body: EventTypeUpdate) =>
    httpClient<EventType>(`/event-types/${id}`, { method: "PATCH", body }),
  remove: (id: number) =>
    httpClient<void>(`/event-types/${id}`, { method: "DELETE" }),
};
