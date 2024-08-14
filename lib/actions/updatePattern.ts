"use server";

import { getPatterns } from "@/lib/actions/getPatterns";
import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { hasConflictingSlots } from "@/lib/processing/hasConflictingSlots";
import { type Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { patternSchema, parseDbData } from "@/lib/schemas/patternsSchema";
import { getInvalidFieldsList } from "@/lib/utils";

export async function updatePattern(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const doctorId = rawData.doctorId as string;
    const patternId = rawData.patternId as string;

    const validation = patternSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const userPattern = validation.data;

    const dbQuery = await getPatterns(doctorId);
    if (!dbQuery.success || !dbQuery.data) {
      throw new Error("Unable to query for stored patterns data");
    }

    const dbPatterns = dbQuery.data.documents;
    for (const dbPattern of dbPatterns) {
      const isConflicting = hasConflictingSlots(userPattern, parseDbData(dbPattern));
      if (isConflicting) {
        return conflictingSlotError();
      }
    }

    const slotUpdated = await databases.updateDocument(
      env.databaseId,
      env.patternsCollectionId,
      patternId,
      {
        ...userPattern,
        doctorId,
      },
    );

    return success(slotUpdated);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
