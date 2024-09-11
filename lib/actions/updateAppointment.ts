"use server";

import { databases, ID, Query } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { isSlotPossible } from "@/lib/processing/isSlotPossible";
import { processSlots } from "@/lib/processing/processSlots";
import { Error, invalidFieldsError, Success, success, unexpectedError } from "@/lib/results";
import { conflictingAppointmentError } from "@/lib/results/errors/conflictingAppointmentError";
import {
  AppointmentParsedData,
  AppointmentStoredData,
  parseAppointmentData,
} from "@/lib/schemas/appointmentsSchema";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { parsePatternData } from "@/lib/schemas/patternsSchema";

export type UpdateAppointmentResult = Error<string[] | undefined> | Success<AppointmentParsedData>;

export async function updateAppointment(formData: FormData): Promise<UpdateAppointmentResult> {
  try {
    const rawData = Object.fromEntries(formData) as any;
    const { doctorId, patientId, patternId, startTime, appointmentId } = rawData;

    const pattern = (await databases.getDocument(
      env.databaseId,
      env.patternsCollectionId,
      rawData.patternId,
    )) as PatternDocumentSchema;

    const startTimeDate = new Date(startTime);
    const parsedData = parsePatternData(pattern);
    const dates = processSlots(parsedData, { exactDate: startTimeDate });
    const possibleSlots = dates[0].slots;
    if (!isSlotPossible(possibleSlots, startTimeDate)) {
      return invalidFieldsError(["startTime"]);
    }

    const startTimeISOString = startTimeDate.toISOString();
    const conflictingAppointments = await databases.listDocuments(
      env.databaseId,
      env.appointmentsCollectionId,
      [Query.equal("doctorId", rawData.doctorId), Query.equal("startTime", startTimeISOString)],
    );

    if (conflictingAppointments.total > 0) {
      return conflictingAppointmentError();
    }

    const appointmentUpdated = (await databases.updateDocument(
      env.databaseId,
      env.appointmentsCollectionId,
      appointmentId,
      { doctorId, patientId, patternId, startTime: startTimeISOString },
    )) as AppointmentStoredData;

    console.log("🚀 ~ rawData:", rawData);
    console.log("🚀 ~ pattern:", pattern);
    console.log("🚀 ~ possibleSlots:", possibleSlots);
    console.log("🚀 ~ starTimeISOString:", startTimeDate.toISOString());
    console.log("🚀 ~ conflictingAppointments:", conflictingAppointments);
    console.log("🚀 ~ appointmentCreated:", appointmentUpdated);

    return success(parseAppointmentData(appointmentUpdated));
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
