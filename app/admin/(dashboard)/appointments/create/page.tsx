"use server";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import ErrorCard from "@/components/shared/ErrorCard";
import { getDoctors } from "@/lib/actions/getDoctors";
import React from "react";

export default async function CreateAppointmentPage() {
  const result = await getDoctors();
  if (!result?.success || !result?.data) {
    return <ErrorCard text="No doctors available for appointments" />;
  }

  const doctors = result.data;

  return (
    <div className="mx-auto w-[1200px]">
      <AppointmentCreator doctors={doctors} />
    </div>
  );
}
