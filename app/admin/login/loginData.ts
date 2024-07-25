import { z } from "zod";
import { loginSchema } from "./loginSchema";

export type LoginData = z.infer<typeof loginSchema>;
