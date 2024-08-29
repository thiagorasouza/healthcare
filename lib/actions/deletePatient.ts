"use server";

import { databases, users } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { userNotFoundError } from "@/lib/results/errors/userNotFoundError";
import { isAppwriteException } from "@/lib/utils";

export async function deletePatient(patientId: string, authId: string) {
  try {
    await databases.deleteDocument(env.databaseId, env.patientsCollectionId, patientId);

    await users.delete(authId);

    return success();
  } catch (error) {
    console.log(error);

    if (isAppwriteException(error) && error.type === "user_not_found") {
      return userNotFoundError();
    }

    return unexpectedError();
  }
}
