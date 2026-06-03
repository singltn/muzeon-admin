import { z } from "zod";

export const verify2faSchema = z.object({
  code: z
    .string()
    .length(6, "Код из 6 цифр")
    .regex(/^\d+$/, "Только цифры"),
});

export type Verify2faFormValues = z.infer<typeof verify2faSchema>;
