import { z } from "zod";

export const exhibitionFormSchema = z.object({
  title: z.string().min(1, "Обязательное поле").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис"),
  type: z.enum([
    "exhibition",
    "lecture",
    "workshop",
    "event",
    "excursion",
  ]),
  status: z.enum(["draft", "published", "active", "archived"]),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
});

export type ExhibitionFormValues = z.infer<typeof exhibitionFormSchema>;
