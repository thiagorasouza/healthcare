"use server";

import { cookies } from "next/headers";
import { success, unexpectedError } from "../results";
import { getAccount } from "@/lib/appwrite/nodeSessionClient";

export async function logout() {
  try {
    const account = getAccount();
    await account.deleteSession("current");
    cookies().delete("session");
    return success();
  } catch (error) {
    return unexpectedError();
  }
}
