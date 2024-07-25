import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      errorMap: () => ({ message: "Invalid email" }),
    })
    .email(),
  password: z
    .string({
      errorMap: () => ({ message: "Invalid password" }),
    })
    .min(8)
    .max(32),
});
