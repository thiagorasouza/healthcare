"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";

export async function deletePattern(patternId: string) {
  try {
    const deletedPattern = await databases.deleteDocument(
      env.databaseId,
      env.patternsCollectionId,
      patternId,
    );

    return success(deletedPattern);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
