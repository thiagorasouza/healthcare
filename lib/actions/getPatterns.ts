"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { PatternDocumentListSchema } from "@/lib/schemas/appwriteSchema";
import { Query } from "node-appwrite";

export async function getPatterns(doctorId: string) {
  try {
    const slotsDocuments: PatternDocumentListSchema = await databases.listDocuments(
      env.databaseId,
      env.patternsCollectionId,
      [Query.equal("doctorId", doctorId)],
    );

    return success(slotsDocuments);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
