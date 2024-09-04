"use server";

import AppointmentUpdateCard from "@/components/appointments/AppoitmentUpdateCard";
import { databases } from "@/lib/appwrite/adminClient";
import { env } from "@/lib/env";
import { parseAppointmentData } from "@/lib/schemas/appointmentsSchema";

export default async function UpdateAppointmentPage({
  params,
}: {
  params: { appointmentId: string };
}) {
  const { appointmentId } = params;

  let appointment;
  try {
    appointment = parseAppointmentData(
      await databases.getDocument(env.databaseId, env.appointmentsCollectionId, appointmentId),
    );
  } catch (error) {
    console.log(error);
  }

  if (!appointment) {
    return <p>Could not find this appointment</p>;
  }

  return <AppointmentUpdateCard data={appointment} />;
}
