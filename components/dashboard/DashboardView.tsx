"use client";

import { Activity, CalendarCheck, Users } from "lucide-react";

import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
import DashboardPatientsCard from "@/components/dashboard/DashboardPatientsCard";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { useEffect, useState } from "react";
import { listAppointments } from "@/server/actions/listAppointments";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";

interface DashboardViewProps {
  doctorsCount: string;
  patientsCount: string;
  appointmentsCount: string;
}

export default function DashboardView({
  doctorsCount,
  patientsCount,
  appointmentsCount,
}: DashboardViewProps) {
  const [appointments, setAppointments] = useState<AppointmentHydrated[] | undefined | "error">();

  useEffect(() => {
    const load = async () => {
      try {
        const result = await listAppointments();
        if (!result.ok) {
          setAppointments("error");
        } else {
          setAppointments(result.value);
        }
      } catch (error) {
        console.log(error);
        setAppointments("error");
      }
    };

    load();
  }, []);

  // console.log("🚀 ~ appointments:", appointments);

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <DashboardStatsCard
          title="Doctor"
          stats={doctorsCount}
          growth="+2 since last month"
          Icon={Activity}
          href="/admin/doctors"
        />
        <DashboardStatsCard
          title="Patients"
          stats={patientsCount}
          growth="+5.1% from last month"
          Icon={Users}
          href="/admin/patients"
        />
        <DashboardStatsCard
          title="Appointments"
          stats={appointmentsCount}
          growth="+18.1% from last month"
          Icon={CalendarCheck}
          href="/admin/appointments"
        />
      </div>
      <div>
        {/* <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"> */}
        {appointments && <AppointmentsTable appointments={appointments} />}
        {/* <DashboardPatientsCard /> */}
      </div>
    </div>
  );
}
