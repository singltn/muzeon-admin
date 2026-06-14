export type EventLocation = {
  id: number;
  name: string;
  description: string | null;
  address: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
};

export type EventLocationCreate = Omit<EventLocation, "id">;
export type EventLocationUpdate = Partial<EventLocationCreate>;
