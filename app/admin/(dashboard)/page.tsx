"use server";

import { Activity, CalendarCheck, Users } from "lucide-react";
import { AppointmentsCard } from "@/components/appointments/AppointmentsCard";
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
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
    <>
      <div className="space-y-4 md:space-y-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <DashboardStatsCard
            title="Doctor"
            stats={doctorsCount}
            Icon={<Activity />}
            href="/admin/doctors"
          />
          <DashboardStatsCard
            title="Patients"
            stats={patientsCount}
            Icon={<Users />}
            href="/admin/patients"
          />
          <DashboardStatsCard
            title="Appointments"
            stats={appointmentsCount}
            Icon={<CalendarCheck />}
            href="/admin/appointments"
          />
        </div>
        <div>
          <AppointmentsCard />
        </div>
      </div>
    </>
  );
}
