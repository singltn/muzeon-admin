import { z } from "zod";

export const museumCreateSchema = z.object({
  name: z.string().min(1, "Обязательно"),
  legal_name: z.string().min(1, "Обязательно"),
  inn: z.string().min(10, "10–12 символов").max(12, "10–12 символов"),
  ogrn: z.string().length(13, "13 символов"),
  email: z.string().email("Некорректный email"),
  phone: z.string().min(11, "11–12 символов").max(12, "11–12 символов"),
  address: z.string().min(1, "Обязательно"),
});

export const museumUpdateAdminSchema = museumCreateSchema
  .partial()
  .extend({
    status: z
      .enum(["trial", "active", "inactive", "blocked"])
      .optional(),
    subscription_plan: z.enum(["free", "basic", "premium"]).optional(),
    subscription_end_date: z.string().nullable().optional(),
  });

export const museumUpdateSelfSchema = museumCreateSchema.partial();

export type MuseumCreateFormData = z.infer<typeof museumCreateSchema>;
export type MuseumUpdateFormData = z.infer<typeof museumUpdateAdminSchema>;
