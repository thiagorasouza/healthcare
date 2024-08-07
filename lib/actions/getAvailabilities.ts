"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { AvDocumentListSchema } from "@/lib/schemas/appwriteSchema";
import { Query } from "node-appwrite";

export async function getAvailabilities(doctorId: string) {
  try {
    const avDocuments: AvDocumentListSchema = await databases.listDocuments(
      env.databaseId,
      env.avCollectionId,
      [Query.equal("doctorId", doctorId)],
    );

    return success(avDocuments);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
