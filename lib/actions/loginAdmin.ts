"use server";

import { cookies } from "next/headers";
import {
  success,
  unexpectedError,
  invalidCredentialsError,
  invalidFieldsError,
} from "@/lib/results";
import { account } from "@/lib/appwrite/adminClient";
import { isAppwriteException, isZodException } from "@/lib/utils";
import { LoginData, loginSchema } from "@/lib/schemas/loginSchema";

export async function loginAdmin(loginData: LoginData) {
  try {
    const validData = loginSchema.parse(loginData);

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
