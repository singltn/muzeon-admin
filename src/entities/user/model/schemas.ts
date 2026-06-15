import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().email("Некорректный email"),
  first_name: z.string().min(1, "Обязательно"),
  last_name: z.string().min(1, "Обязательно"),
  role: z.enum(["museum_admin", "museum_stuff"], {
    required_error: "Выберите роль",
  }),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(1, "Обязательно"),
  last_name: z.string().min(1, "Обязательно"),
  role: z.enum(["museum_admin", "museum_stuff"]),
  is_active: z.boolean(),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
