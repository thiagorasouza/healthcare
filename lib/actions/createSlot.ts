"use server";

import { getSlots } from "@/lib/actions/getSlots";
import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { hasConflictingSlots } from "@/lib/processing/hasConflictingSlots";
import { type Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { slotSchema, parseDbData } from "@/lib/schemas/slotsSchema";
import { getInvalidFieldsList } from "@/lib/utils";

export async function createSlot(formData: FormData): Promise<Success<unknown> | Error<unknown>> {
  try {
    const rawData = Object.fromEntries(formData);
    const doctorId = rawData.doctorId as string;

    const validation = slotSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const userData = validation.data;

    const result = await getSlots(doctorId);
    if (!result.success || !result.data) {
      throw new Error("Unable to query for stored availability data");
    }

    const documents = result.data.documents;
    for (const dbData of documents) {
      const isConflicting = hasConflictingSlots(userData, parseDbData(dbData));
      if (isConflicting) {
        return conflictingSlotError();
      }
    }

    const slotCreated = await databases.createDocument(
      env.databaseId,
      env.slotsCollectionId,
      ID.unique(),
      {
        ...userData,
        doctorId,
      },
    );

    return success(slotCreated);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
