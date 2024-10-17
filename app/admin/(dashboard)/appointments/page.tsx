"use server";

import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { listAppointments } from "@/server/actions/listAppointments.bypass";

export default async function AppointmentsPage() {
  const appointmentsResult = await listAppointments();
  const appointments = appointmentsResult.ok ? appointmentsResult.value : "error";

  return <AppointmentsTable appointments={appointments} />;
}
