"use server";

import { databases, users } from "@/lib/appwrite/adminClient";
import { success, unexpectedError } from "@/lib/results";
import { userNotFoundError } from "@/lib/results/errors/userNotFoundError";
import { isAppwriteException } from "@/lib/utils";

export async function deleteDoctor(doctorId: string, authId: string) {
  // console.log("🚀 ~ doctorId:", doctorId);
  // console.log("🚀 ~ authId:", authId);
  try {
    await databases.deleteDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTORS_COLLECTION_ID!,
      doctorId,
    );

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
