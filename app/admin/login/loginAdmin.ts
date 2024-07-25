"use server";

import { z } from "zod";
import { loginSchema } from "./page";

type LoginData = z.infer<typeof loginSchema>;

export async function loginAdmin(data: LoginData) {
  return {
    message: "success",
  };
}
