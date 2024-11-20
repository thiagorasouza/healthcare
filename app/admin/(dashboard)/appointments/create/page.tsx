"use server";

import { getDoctors } from "@/server/actions/getDoctors.bypass";

export default async function CreateAppointmentPage() {
  const doctorsResult = await getDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";

  // return <AppointmentCreator doctors={doctors} />;
}
