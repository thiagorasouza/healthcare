"use server";

import { LoginData } from "./loginData";
import { loginSchema } from "./loginSchema";
import { cookies } from "next/headers";
import {
  success,
  unexpectedError,
  invalidCredentialsError,
  invalidFieldsError,
  Result,
} from "@/lib/results";
import { ZodError } from "zod";
import { account, AppwriteException } from "@/lib/appwrite/adminClient";

export async function loginAdmin(initialState: any, formData: FormData) {
  try {
    const loginData = Object.fromEntries(formData);
    const validData = loginSchema.parse(loginData);
    // console.log("🚀 ~ validData:", validData);

    const session = await account.createEmailPasswordSession(
      validData.email,
      validData.password,
    );

    cookies().set("session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(session.expire),
      path: "/",
    });

    return success();
  } catch (error) {
    // console.error(error);

    if (isAppwriteException(error)) {
      if (error.type === "user_invalid_credentials") {
        return invalidCredentialsError();
      }
    }

    if (isZodException(error)) {
      return invalidFieldsError();
    }

    return unexpectedError();
  }
}

function isAppwriteException(error: any): error is AppwriteException {
  return (
    typeof error === "object" &&
    error !== null &&
    error.constructor.name === "AppwriteException"
  );
}

function isZodException(error: any): error is ZodError {
  return (
    typeof error === "object" &&
    error !== null &&
    error.constructor.name === "ZodError"
  );
}
