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
  appointmentZodSchema,
  parseAppointmentData,
} from "@/lib/schemas/appointmentsSchema";
import { parsePatternData } from "@/lib/schemas/patternsSchema";
import { getInvalidFieldsList } from "@/lib/utils";
import { validateWithZod } from "@/lib/validation/validateWithZod";
import {} from "zod";

export type CreateAppointmentResult = Error<string[] | undefined> | Success<AppointmentParsedData>;

// algorithm
// 1. validate input data
// 2. check if doctor exists
// 3. check if patient exists
// 4. check if appointment time is possibile for this doctor
// 5. check if appointment time is possibile for this patient
// 6. save appointment data

export async function createAppointment(formData: FormData): Promise<CreateAppointmentResult> {
  try {
    // const rawData = Object.fromEntries(formData) as any;
    // const validation = validateWithZod(appointmentZodSchema, rawData);
    // if (!validation.success) {
    //   return invalidFieldsError(validation.data);
    // }
    // const { doctorId, patientId, startTime } = validation.data;
    // const doctor = await databases.getDocument();
    // const patterns = await databases.listDocuments(env.databaseId, env.patternsCollectionId);
    // const startTimeDate = new Date(startTime);
    // const parsedData = parsePatternData(pattern);
    // const dates = processSlots(parsedData, { exactDate: startTimeDate });
    // const possibleSlots = dates[0].slots;
    // if (!isSlotPossible(possibleSlots, startTimeDate)) {
    //   return invalidFieldsError(["startTime"]);
    // }
    // const startTimeISOString = startTimeDate.toISOString();
    // const conflictingAppointments = await databases.listDocuments(
    //   env.databaseId,
    //   env.appointmentsCollectionId,
    //   [Query.equal("doctorId", rawData.doctorId), Query.equal("startTime", startTimeISOString)],
    // );
    // if (conflictingAppointments.total > 0) {
    //   return conflictingAppointmentError();
    // }
    // const appointmentCreated = (await databases.createDocument(
    //   env.databaseId,
    //   env.appointmentsCollectionId,
    //   ID.unique(),
    //   { doctorId, patientId, patternId, startTime: startTimeISOString },
    // )) as AppointmentStoredData;
    // console.log("🚀 ~ rawData:", rawData);
    // console.log("🚀 ~ pattern:", pattern);
    // console.log("🚀 ~ possibleSlots:", possibleSlots);
    // console.log("🚀 ~ starTimeISOString:", startTimeDate.toISOString());
    // console.log("🚀 ~ conflictingAppointments:", conflictingAppointments);
    // console.log("🚀 ~ appointmentCreated:", appointmentCreated);
    // return success(parseAppointmentData(appointmentCreated));
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
