"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { success, unexpectedError } from "@/lib/results";
import { DoctorDocumentListSchema } from "@/lib/schemas/appwriteSchema";

export async function getAllDoctors() {
  try {
    const allDoctors: DoctorDocumentListSchema = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.DOCTORS_COLLECTION_ID!,
      [],
    );

    return success(allDoctors.documents);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
