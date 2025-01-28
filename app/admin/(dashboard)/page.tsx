"use client";

import { Activity, ArrowRight, CalendarCheck, Users } from "lucide-react";
import { countAppointments } from "@/server/actions/countAppointments.bypass";
import { countDoctors } from "@/server/actions/countDoctors.bypass";
import { countPatients } from "@/server/actions/countPatients.bypass";
import { AppointmentsCard } from "@/components/appointments/AppointmentsCard";
import React, { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const [doctorsCount, setDoctorsCount] = useState<string | "error">();
  const [patientsCount, setPatientsCount] = useState<string | "error">();
  const [appointmentsCount, setAppointmentsCount] = useState<string | "error">();

  useEffect(() => {
    async function loadCounters() {
      const doctorsCountResult = await countDoctors();
      setDoctorsCount(doctorsCountResult.ok ? String(doctorsCountResult.value) : "error");

      const patientsCountResult = await countPatients();
      setPatientsCount(patientsCountResult.ok ? String(patientsCountResult.value) : "error");

      const appointmentsCountResult = await countAppointments();
      setAppointmentsCount(
        appointmentsCountResult.ok ? String(appointmentsCountResult.value) : "error",
      );
    }

    loadCounters();
  }, []);

  return (
    <>
      <div className="space-y-4 md:space-y-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <DashboardStatsCard
            title="Doctors"
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

interface DashboardCardProps {
  title: string;
  stats?: string;
  growth?: string;
  Icon: ReactElement;
  href: string;
}

function DashboardStatsCard({ title, stats, growth = "", Icon, href }: DashboardCardProps) {
  const statsError = stats === "error";
  const statsLoading = stats === undefined;

  const styledIcon = React.cloneElement(Icon, {
    className: "h-4 w-4 text-muted-foreground",
  });

  return (
    <Link href={href} target="_blank">
      <Card className="group flex overflow-hidden hover:cursor-pointer">
        <div className="flex-1">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            {styledIcon}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsError && "--"}
              {statsLoading && <LoadingSpinner className="h-4 w-4" />}
              {!statsError && !statsLoading && stats}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsError && "An error ocurred. Please refresh the page to fetch again"}
            </p>
          </CardContent>
        </div>
        <div className="ml-auto flex items-center self-stretch bg-muted px-1 transition-all group-hover:px-3">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Card>
    </Link>
  );
}
