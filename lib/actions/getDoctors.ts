"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { Doctor } from "@/lib/schemas/doctorsSchema";

export async function getDoctors() {
  try {
    const doctors = await databases.listDocuments(env.databaseId, env.doctorsCollectionId, []);

    return success(doctors.documents as Doctor[]);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
