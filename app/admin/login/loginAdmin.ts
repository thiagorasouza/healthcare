"use server";

import * as sdk from "node-appwrite";
import { LoginData } from "./loginData";
import { loginSchema } from "./loginSchema";
import { cookies } from "next/headers";
import {
  success,
  unexpectedError,
  invalidCredentialsError,
} from "@/lib/results";

const client = new sdk.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

const account = new sdk.Account(client);

export async function loginAdmin(data: LoginData) {
  try {
    const validData = loginSchema.parse(data);

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

    return unexpectedError();
  }
}

function isAppwriteException(error: any): error is sdk.AppwriteException {
  return (
    typeof error === "object" &&
    error !== null &&
    error.constructor.name === "AppwriteException"
  );
}
