"use server";

import { getPatterns } from "@/lib/actions/getPatterns";
import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { hasConflictingSlots } from "@/lib/processing/hasConflictingSlots";
import { hasSlots } from "@/lib/processing/hasSlots";
import { type Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { noPossibleSlotsError } from "@/lib/results/errors/noPossibleSlotsError";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { patternSchema, parseDbData } from "@/lib/schemas/patternsSchema";
import { getInvalidFieldsList } from "@/lib/utils";

export type CreatePatternResult = Success<PatternDocumentSchema> | Error<string[] | undefined>;

export async function createPattern(formData: FormData): Promise<CreatePatternResult> {
  try {
    const rawData = Object.fromEntries(formData);
    const doctorId = rawData.doctorId as string;

    const validation = patternSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const userData = validation.data;

    if (userData.recurring && !hasSlots(userData)) {
      return noPossibleSlotsError();
    }

    const result = await getPatterns(doctorId);
    if (!result.success || !result.data) {
      throw new Error("Unable to query for stored patterns");
    }

    const documents = result.data.documents;
    for (const dbData of documents) {
      const isConflicting = hasConflictingSlots(userData, parseDbData(dbData));
      if (isConflicting) {
        return conflictingSlotError();
      }
    }

    const slotCreated = (await databases.createDocument(
      env.databaseId,
      env.patternsCollectionId,
      ID.unique(),
      {
        ...userData,
        doctorId,
      },
    )) as PatternDocumentSchema;

    return success(parseDbData(slotCreated));
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
