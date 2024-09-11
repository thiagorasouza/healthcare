"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { parsePatternData, Pattern } from "@/lib/schemas/patternsSchema";
import { Query } from "node-appwrite";

export async function getPatternsByDoctorId(doctorId: string, exceptId?: string) {
  try {
    let query = [Query.equal("doctorId", doctorId)];
    if (exceptId) {
      query = query.concat([Query.notEqual("$id", exceptId)]);
    }

    const patterns = await databases.listDocuments(env.databaseId, env.patternsCollectionId, query);
    const parsedPatterns = patterns.documents.map((pattern) => parsePatternData(pattern));

    return success(parsedPatterns as Pattern[]);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
