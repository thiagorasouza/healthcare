"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { DoctorDocumentListSchema } from "@/lib/schemas/appwriteSchema";

export async function getAllDoctors() {
  try {
    const allDoctors: DoctorDocumentListSchema = await databases.listDocuments(
      env.databaseId,
      env.doctorsCollectionId,
      [],
    );

    return success(allDoctors.documents);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
