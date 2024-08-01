"use server";

import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { availabilitySchema, getRawAvailabilityData } from "@/lib/schemas/availabilitySchema";
import { getInvalidFieldsList } from "@/lib/utils";
import { Query } from "node-appwrite";

export async function createAvailability(
  formData: FormData,
): Promise<Success<unknown> | Error<unknown>> {
  try {
    const rawData = getRawAvailabilityData(formData);
    const doctorId = rawData.doctorId;

    const validation = availabilitySchema.safeParse({
      startTime: new Date(rawData.startTime as string),
      endTime: new Date(rawData.endTime as string),
      duration: rawData.duration,
    });
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }

    const validData = validation.data;

    const conflictingSlots = await databases.listDocuments(env.databaseId, env.avCollectionId, [
      Query.and([
        Query.or([
          Query.and([
            Query.greaterThanEqual("startTime", rawData.startTime as string),
            Query.lessThan("startTime", rawData.endTime as string),
          ]),
          Query.and([
            Query.greaterThan("endTime", rawData.startTime as string),
            Query.lessThanEqual("endTime", rawData.endTime as string),
          ]),
        ]),
        Query.equal("doctorId", doctorId as string),
      ]),
    ]);

    if (conflictingSlots.total > 0) {
      return conflictingSlotError();
    }

    const diff = (validData.endTime.getTime() - validData.startTime.getTime()) / (60 * 1000);
    const duration = Number(validData.duration);
    const slots = diff / duration;

    const slotsCreated = [];
    for (let i = 0; i < slots; i++) {
      const durationMs = duration * 60 * 1000;
      const startTimeMs = validData.startTime.getTime() + durationMs * i;
      const endTimeMs = startTimeMs + durationMs;

      slotsCreated.push(
        await databases.createDocument(env.databaseId, env.avCollectionId, ID.unique(), {
          doctorId,
          startTime: new Date(startTimeMs),
          endTime: new Date(endTimeMs),
        }),
      );
    }

    return success(slotsCreated);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
