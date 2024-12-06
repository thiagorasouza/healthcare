import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { LoginRequest } from "@/server/useCases/login/loginUseCase";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginValidator = new GenericValidator<LoginRequest>(loginSchema);
