"use server";

import DashboardView from "@/components/dashboard/DashboardView";
import { countAppointments } from "@/server/actions/countAppointments.bypass";
import { countDoctors } from "@/server/actions/countDoctors.bypass";
import { countPatients } from "@/server/actions/countPatients.bypass";

export default async function DashboardPage() {
  const doctorsCountResult = await countDoctors();
  const doctorsCount = doctorsCountResult.ok ? String(doctorsCountResult.value) : "error";

  const patientsCountResult = await countPatients();
  const patientsCount = patientsCountResult.ok ? String(patientsCountResult.value) : "error";

  const appointmentsCountResult = await countAppointments();
  const appointmentsCount = appointmentsCountResult.ok
    ? String(appointmentsCountResult.value)
    : "error";

  return (
    <DashboardView
      doctorsCount={doctorsCount}
      patientsCount={patientsCount}
      appointmentsCount={appointmentsCount}
    />
  );
}
