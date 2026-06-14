import { z } from "zod";

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Обязательно").max(255, "Максимум 255 символов"),
  description: z.string().min(1, "Обязательно"),
  capacity: z.coerce.number().min(0, "Не менее 0"),
  date_start: z.string().min(1, "Обязательно"),
  date_end: z.string().optional(),
  type_id: z.coerce.number().min(1, "Выберите тип"),
  location_id: z.coerce.number().min(1, "Выберите площадку"),
  is_recurring: z.boolean(),
});

export const eventUpdateSchema = eventCreateSchema.partial().extend({
  status: z.enum(["draft", "published", "archived", "canceled"]).optional(),
});

export type EventCreateFormData = z.infer<typeof eventCreateSchema> & {
  date_end?: string | null;
};
export type EventUpdateFormData = z.infer<typeof eventUpdateSchema>;
