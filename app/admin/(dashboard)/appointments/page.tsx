"use server";

import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { listAppointments } from "@/server/actions/listAppointments";

export default async function AppointmentsPage() {
  const appointmentsResult = await listAppointments();
  console.log("🚀 ~ appointmentsResult:", appointmentsResult);
  const appointments = appointmentsResult.ok ? appointmentsResult.value : "error";
  // const appointments = "error";

  return <AppointmentsTable appointments={appointments} />;
}
