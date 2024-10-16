"use client";

import { Activity, CalendarCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";
import DashboardAppointmentsCard from "@/components/dashboard/DashboardAppointmentsCard";
import DashboardPatientsCard from "@/components/dashboard/DashboardPatientsCard";

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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardAppointmentsCard />
        <DashboardPatientsCard />
      </div>
    </div>
  );
}
