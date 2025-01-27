"use client";

import LoadingPage from "@/app/loading";
import { CalendarLink } from "@/components/appointments/create/CalendarLink";
import { DoctorCard } from "@/components/appointments/create/DoctorCard";
import SendEmailDialog from "@/components/appointments/create/SendEmailDialog";
import { FindAppointmentForm } from "@/components/appointments/FindAppointmentForm";
import { AppointmentPublicData, getAppointmentsLS } from "@/lib/localStorage";
import { cn, colorize } from "@/lib/utils";
import { joinDateTime } from "@/server/useCases/shared/helpers/date";
import { format, isFuture } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
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
    <div className="min-h-screen w-full md:bg-[#212121]">
      <div className="mx-auto flex max-w-[1580px] flex-1 justify-center gap-10 p-3">
        <aside className="hidden flex-shrink-0 flex-col py-4 xl:flex">
          <header className="mb-8 px-4">
            <Link className="flex items-center gap-2" href="/">
              <Image
                src="/img/logo-dark.svg"
                alt="heartbeat logo"
                width={42}
                height={42}
                className="hidden md:block"
              />
              <h2 className="text-2xl font-medium text-white">Mednow</h2>
            </Link>
          </header>
          <nav></nav>
        </aside>
        <main className="relative flex w-full flex-col items-center gap-8 rounded-3xl bg-white px-2 py-14 md:px-3 lg:px-6 xl:w-[80%]">
          <h1 className="text-center text-3xl font-semibold">Your Upcoming Appointments</h1>
          <div className="mt-4 max-w-[500px]">
            <p className="mb-4 text-sm">
              If you appointment is not displayed here, please search it below:
            </p>
            <FindAppointmentForm onFound={onFound} />
          </div>
          {appointments.map(({ id, patient, doctor, date, hour, duration }, index) => (
            <article key={index} className="flex flex-col items-center justify-center gap-6 py-8">
              {/* <header className="flex items-center justify-center gap-4 pl-1 pr-12 text-center">
                  <CheckCircle className="h-7 w-7 flex-shrink-0 text-green-400" />
                  <h2 className="text-2xl font-semibold">Appointment booked successfully</h2>
                </header> */}
              <section className="flex flex-col gap-6 lg:flex-row lg:justify-center">
                {/* Doctor image and name */}
                <DoctorCard colorIndex={3} doctor={doctor} fixed={true} className="flex-1" />
                {/* Vertical Ruler */}
                <div className="inset-0 hidden items-center lg:flex">
                  <span className="h-[70%] border-l-2 border-dashed"></span>
                </div>
                {/* Patient, date and hour */}
                <div className="flex flex-1 flex-col justify-center gap-4">
                  <div className="flex w-full items-center gap-4 rounded-3xl p-5 pr-7 shadow">
                    <div className={cn(patientBgColor, "w-fit rounded-2xl p-4")}>
                      <Clock className="h-5 w-5" />
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
                {/* <Button variant="outline" asChild>
                    <Link href="/">
                      <House />
                      Back to Home
                    </Link>
                  </Button> */}
                <SendEmailDialog appointmentId={id} />
                <CalendarLink
                  name={doctor.name}
                  specialty={doctor.specialty}
                  startTime={joinDateTime(date, hour)}
                  duration={duration}
                />
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
