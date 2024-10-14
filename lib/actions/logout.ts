"use server";

import { cookies } from "next/headers";
import { success, unexpectedError } from "../results";
import { account } from "@/lib/appwrite/nodeSessionClient";

export async function logout() {
  try {
    await account.deleteSession("current");
    cookies().delete("session");
    return success();
  } catch (error) {
    return unexpectedError();
  }
}
