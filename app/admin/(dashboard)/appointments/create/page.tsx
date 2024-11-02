"use server";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { getDoctors } from "@/server/actions/getDoctors.bypass";
import React from "react";

export default async function CreateAppointmentPage() {
  const doctorsResult = await getDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";

  return <AppointmentCreator doctors={doctors} />;
}
