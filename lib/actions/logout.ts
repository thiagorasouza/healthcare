"use server";

import { cookies } from "next/headers";
import { getNodeSessionClient } from "../appwrite/nodeSessionClient";
import { success, unexpectedError } from "../results";

export async function logout() {
  try {
    // throw new Error();
    const { client, account } = getNodeSessionClient();
    await account.deleteSession("current");
    cookies().delete("session");
    return success();
  } catch (error) {
    return unexpectedError();
  }
}
