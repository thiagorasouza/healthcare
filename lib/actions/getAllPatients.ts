"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { PatientsListStoredData } from "@/lib/schemas/patientsSchema";

export async function getAllPatients() {
  try {
    const allPatients = (await databases.listDocuments(
      env.databaseId,
      env.patientsCollectionId,
    )) as PatientsListStoredData;
    console.log("🚀 ~ allPatients:", allPatients);

    return success(allPatients.documents);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
