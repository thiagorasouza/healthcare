"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { SlotDocumentListSchema } from "@/lib/schemas/appwriteSchema";
import { Query } from "node-appwrite";

export async function getSlots(doctorId: string) {
  try {
    const slotsDocuments: SlotDocumentListSchema = await databases.listDocuments(
      env.databaseId,
      env.slotsCollectionId,
      [Query.equal("doctorId", doctorId)],
    );

    return success(slotsDocuments);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
