"use server";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { getDoctors } from "@/server/actions/getDoctors.bypass";

export default async function BookPage() {
  const doctorsResult = await getDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <AppointmentCreator doctors={doctors} />
    </div>
  );
}
