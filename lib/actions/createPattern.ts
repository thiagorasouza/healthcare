"use server";

import { getPatterns } from "@/lib/actions/getPatterns";
import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { hasConflictingSlots } from "@/lib/processing/hasConflictingSlots";
import { type Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { patternSchema, parseDbData } from "@/lib/schemas/patternsSchema";
import { getInvalidFieldsList } from "@/lib/utils";

export async function createPattern(
  formData: FormData,
): Promise<Success<unknown> | Error<unknown>> {
  try {
    const rawData = Object.fromEntries(formData);
    const doctorId = rawData.doctorId as string;

    const validation = patternSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const userData = validation.data;

    const result = await getPatterns(doctorId);
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
      env.patternsCollectionId,
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
