"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";
import { AppointmentsStoredData } from "@/lib/schemas/appointmentsSchema";
import { Query } from "node-appwrite";

export async function getDoctorAppointments(doctorId: string) {
  try {
    const appointments = (await databases.listDocuments(
      env.databaseId,
      env.appointmentsCollectionId,
      [Query.equal("doctorId", doctorId)],
    )) as AppointmentsStoredData;
    return success(appointments);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
