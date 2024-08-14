"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { PatternDocumentListSchema } from "@/lib/schemas/appwriteSchema";
import { parseDbData } from "@/lib/schemas/patternsSchema";
import { Query } from "node-appwrite";

export async function getPatterns(doctorId: string, exceptId?: string) {
  try {
    let query = [Query.equal("doctorId", doctorId)];
    if (exceptId) {
      query = query.concat([Query.notEqual("$id", exceptId)]);
    }

    const patterns: PatternDocumentListSchema = await databases.listDocuments(
      env.databaseId,
      env.patternsCollectionId,
      query,
    );

    const parsedPatterns = {
      total: patterns.total,
      documents: patterns.documents.map((pattern) => parseDbData(pattern)),
    };

    return success(parsedPatterns);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
