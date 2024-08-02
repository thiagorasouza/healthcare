"use server";

import { databases, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingSlotError } from "@/lib/results/errors/conflictingSlotError";
import { availabilitySchema, Weekday, weekdays } from "@/lib/schemas/availabilitySchema";
import {
  getFirstWeekdayAfter,
  getInvalidFieldsList,
  strToBoolean,
  transposeTime,
} from "@/lib/utils";
import { isBefore } from "date-fns";
import { Query } from "node-appwrite";

export async function createAvailability(
  formData: FormData,
): Promise<Success<unknown> | Error<unknown>> {
  try {
    const rawData = Object.fromEntries(formData);
    const doctorId = rawData.doctorId as string;

    const parsedData = {
      startTime: new Date(rawData.startTime as string),
      endTime: new Date(rawData.endTime as string),
      endDate: new Date(rawData.endDate as string),
      duration: rawData.duration,
      recurring: strToBoolean(rawData.recurring as string),
      mon: strToBoolean(rawData.mon as string),
      tue: strToBoolean(rawData.tue as string),
      wed: strToBoolean(rawData.wed as string),
      thu: strToBoolean(rawData.thu as string),
      fri: strToBoolean(rawData.fri as string),
      sat: strToBoolean(rawData.sat as string),
      sun: strToBoolean(rawData.sun as string),
    };

    const validation = availabilitySchema.safeParse(parsedData);
    if (!validation.success) {
      const fieldsList = getInvalidFieldsList(validation);
      return invalidFieldsError(fieldsList);
    }
    const validData = validation.data;
    const duration = Number(validData.duration);

    const checkForConflictingSlots = async (
      startTime: string,
      endTime: string,
      doctorId: string,
    ) => {
      return await databases.listDocuments(env.databaseId, env.avCollectionId, [
        Query.and([
          Query.or([
            Query.and([
              Query.greaterThanEqual("startTime", startTime),
              Query.lessThan("startTime", endTime),
            ]),
            Query.and([
              Query.greaterThan("endTime", startTime),
              Query.lessThanEqual("endTime", endTime),
            ]),
          ]),
          Query.equal("doctorId", doctorId),
        ]),
      ]);
    };

    const createSlots = async (startTime: Date, endTime: Date, durationMin: number) => {
      const diffMin = (endTime.getTime() - startTime.getTime()) / (60 * 1000);
      const slots = diffMin / durationMin;

      const slotsCreated = [];
      for (let i = 0; i < slots; i++) {
        const durationMs = durationMin * 60 * 1000;
        const startTimeMs = startTime.getTime() + durationMs * i;
        const endTimeMs = startTimeMs + durationMs;

        const document = await databases.createDocument(
          env.databaseId,
          env.avCollectionId,
          ID.unique(),
          {
            doctorId,
            startTime: new Date(startTimeMs),
            endTime: new Date(endTimeMs),
          },
        );
        slotsCreated.push(document);
      }
      return slotsCreated;
    };

    let slotsCreated: any[] = [];
    if (validData.recurring) {
      const selectedWeekdays = weekdays.filter((weekday) => validData[weekday]);
      let startDate = validData.startTime;
      let nextDate = getFirstWeekdayAfter(startDate, selectedWeekdays[0]);
      const endDate = validData.endDate;
      let count = 0;

      while (isBefore(nextDate, endDate) && count < 100) {
        const startTime = transposeTime(validData.startTime, nextDate);
        const endTime = transposeTime(validData.endTime, nextDate);

        const conflictingSlots = await checkForConflictingSlots(
          startTime.toISOString(),
          endTime.toISOString(),
          doctorId,
        );
        if (conflictingSlots.total > 0) {
          return conflictingSlotError();
        }

        const slots = await createSlots(startTime, endTime, duration);
        slotsCreated = slotsCreated.concat(slots);

        count++;
        startDate = nextDate;
        nextDate = getFirstWeekdayAfter(
          startDate,
          selectedWeekdays[count % selectedWeekdays.length],
        );
      }
    } else {
      const conflictingSlots = await checkForConflictingSlots(
        rawData.startTime as string,
        rawData.endTime as string,
        doctorId,
      );
      if (conflictingSlots.total > 0) {
        return conflictingSlotError();
      }

      const slots = await createSlots(validData.startTime, validData.endTime, duration);
      slotsCreated = slotsCreated.concat(slots);
    }

    return success(slotsCreated);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
