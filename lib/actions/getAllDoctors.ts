"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { Result, success, unexpectedError } from "@/lib/results";
import { AppwriteDoctorData } from "../schemas/doctorsSchema";

export async function getAllDoctors() {
  try {
    const allDoctors = await databases.listDocuments(
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
