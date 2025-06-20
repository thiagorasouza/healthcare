"use client";

import LoadingPage from "@/app/loading";
import { AppointmentCalendarLink } from "@/components/appointments/AppointmentCalendarLink";
import { AppointmentDoctorCard } from "@/components/appointments/AppointmentDoctorCard";
import AppointmentSendEmailDialog from "@/components/appointments/AppointmentSendEmailDialog";
import { FindAppointmentForm } from "@/components/appointments/FindAppointmentForm";
import { AppointmentPublicData, getAppointmentsLS } from "@/lib/actions/localStorage";
import { cn, colorize } from "@/lib/utils";
import { joinDateTime } from "@/server/useCases/shared/helpers/date";
import { format, isFuture } from "date-fns";
import { CalendarDays, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentPublicData[]>();
  const patientBgColor = colorize(4);
  const dateBgColor = colorize(1);
  const hourBgColor = colorize(2);

  useEffect(() => {
    const appointments = getAppointmentsLS();
    const upcoming = appointments.filter((ap) => isFuture(ap.date)).reverse();
    setAppointments(upcoming);
  }, []);

  function onFound(appointments: AppointmentPublicData[]) {
    setAppointments(appointments);
  }

  if (!appointments) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-14">
      <h1 className="text-center text-3xl font-semibold">Your Upcoming Appointments</h1>
      <div className="mt-4 max-w-[500px]">
        <p className="mb-4 text-sm">
          If you appointment is not displayed here, please search it below:
        </p>
        <FindAppointmentForm onFound={onFound} />
      </div>
      {appointments.map(({ id, patient, doctor, date, hour, duration }, index) => (
        <article key={index} className="flex flex-col items-center justify-center gap-6 py-8">
          <section className="flex flex-col gap-6 lg:flex-row lg:justify-center">
            {/* Doctor image and name */}
            <AppointmentDoctorCard colorIndex={3} doctor={doctor} fixed={true} className="flex-1" />
            {/* Vertical Ruler */}
            <div className="inset-0 hidden items-center lg:flex">
              <span className="h-[70%] border-l-2 border-dashed"></span>
            </div>
            {/* Patient, date and hour */}
            <div className="flex flex-1 flex-col justify-center gap-4">
              <div className="flex w-full items-center gap-4 rounded-3xl p-5 pr-7 shadow">
                <div className={cn(patientBgColor, "w-fit rounded-2xl p-4")}>
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-gray">Patient</h2>
                  <p className="text-base font-medium">{patient.name}</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-4 rounded-3xl p-5 pr-7 shadow">
                <div className={cn(dateBgColor, "w-fit rounded-2xl p-4")}>
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-gray">Date</h2>
                  <p className="text-base font-medium">{format(date, "PPP")}</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-4 rounded-3xl p-5 pr-7 shadow">
                <div className={cn(hourBgColor, "w-fit rounded-2xl p-4")}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-gray">Hour</h2>
                  <p className="text-base font-medium">{hour}</p>
                </div>
              </div>
            </div>
          </section>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row">
            <AppointmentSendEmailDialog appointmentId={id} />
            <AppointmentCalendarLink
              name={doctor.name}
              specialty={doctor.specialty}
              startTime={joinDateTime(date, hour)}
              duration={duration}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
