"use server";

import { getPatterns } from "@/lib/actions/getPatterns";
import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { hasConflictingSlots } from "@/lib/processing/hasConflictingSlots";
import { hasSlots } from "@/lib/processing/hasSlots";
import { type Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { noPossibleSlotsError } from "@/lib/results/errors/noPossibleSlotsError";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { patternSchema, parseDbData } from "@/lib/schemas/patternsSchema";
import { getInvalidFieldsList } from "@/lib/utils";

export type UpdatePatternResult = Success<PatternDocumentSchema> | Error<string[] | undefined>;

export async function updatePattern(formData: FormData): Promise<UpdatePatternResult> {
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
    console.log("🚀 ~ hasSlots(userPattern):", hasSlots(userPattern));

    if (userPattern.recurring && !hasSlots(userPattern)) {
      return noPossibleSlotsError();
    }

    const dbQuery = await getPatterns(doctorId, patternId);
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

    const slotUpdated = (await databases.updateDocument(
      env.databaseId,
      env.patternsCollectionId,
      patternId,
      {
        ...userPattern,
        doctorId,
      },
    )) as PatternDocumentSchema;

    return success(slotUpdated);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
