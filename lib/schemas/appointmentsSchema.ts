import { Models } from "node-appwrite";
import { z } from "zod";

export const appointmentZodSchema = z.object({
  doctorId: z.string(),
  patientId: z.string(),
  startTime: z.coerce.date(),
});

export type AppointmentStoredData = {
  doctorId: string;
  patientId: string;
  patternId: string;
  startTime: string;
} & Models.Document;

export type AppointmentsStoredData = Models.DocumentList<AppointmentStoredData>;

export type AppointmentParsedData = {
  doctorId: string;
  patientId: string;
  patternId: string;
  startTime: Date;
} & Models.Document;

export type IdentificationData = Models.File;

export function parseAppointmentData(dbData: AppointmentStoredData): AppointmentParsedData {
  return {
    ...dbData,
    startTime: new Date(dbData.startTime),
  };
}
