import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "Обязательно"),
  description: z.string().optional(),
  address: z.string().min(1, "Обязательно"),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  is_active: z.boolean(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
