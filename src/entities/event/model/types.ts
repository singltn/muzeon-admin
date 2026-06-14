export type EventStatus = "draft" | "published" | "archived" | "canceled";

export type Event = {
  id: number;
  title: string;
  description: string;
  capacity: number;
  date_start: string;
  date_end: string | null;
  status: EventStatus;
  type_id: number;
  type?: { id: number; name: string };
  location_id: number;
  location?: { id: number; name: string };
  is_recurring: boolean;
  museum_id: number;
};

export type EventCreate = {
  title: string;
  description: string;
  capacity: number;
  date_start: string;
  date_end: string | null;
  type_id: number;
  location_id: number;
  is_recurring: boolean;
};

export type EventUpdate = Partial<EventCreate> & {
  status?: EventStatus;
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  archived: "Архив",
  canceled: "Отменено",
};

export const EVENT_STATUS_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  draft: ["published", "canceled"],
  published: ["archived", "canceled"],
  archived: [],
  canceled: [],
};
