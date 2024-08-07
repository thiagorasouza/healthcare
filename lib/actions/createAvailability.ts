"use server";

import { getAvailabilities } from "@/lib/actions/getAvailabilities";
import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { hasConflictingSlots } from "@/lib/processing/hasConflictingSlots";
import { type Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { availabilitySchema, parseDbData } from "@/lib/schemas/availabilitySchema";
import { getInvalidFieldsList } from "@/lib/utils";

export async function createAvailability(
  formData: FormData,
): Promise<Success<unknown> | Error<unknown>> {
  try {
    const rawData = Object.fromEntries(formData);
    const doctorId = rawData.doctorId as string;

    const validation = availabilitySchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const userData = validation.data;

    const result = await getAvailabilities(doctorId);
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

    const avCreated = await databases.createDocument(
      env.databaseId,
      env.avCollectionId,
      ID.unique(),
      {
        ...userData,
        doctorId,
      },
    );

    return success(avCreated);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
