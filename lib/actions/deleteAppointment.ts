"use server";

import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { success, unexpectedError } from "@/lib/results";

export async function deleteAppointment(appointmentId: string) {
  try {
    const deletedAppointment = await databases.deleteDocument(
      env.databaseId,
      env.appointmentsCollectionId,
      appointmentId,
    );
    return success(deletedAppointment);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
