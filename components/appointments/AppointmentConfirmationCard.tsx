"use client";

import { AppointmentCalendarLink } from "@/components/appointments/AppointmentCalendarLink";
import { AppointmentDoctorCard } from "@/components/appointments/AppointmentDoctorCard";
import AppointmentSendEmailDialog from "@/components/appointments/AppointmentSendEmailDialog";
import { Button } from "@/components/ui/button";
import { cn, colorize } from "@/lib/utils";
import { idLabels } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";
import { displayDate, joinDateTime } from "@/server/useCases/shared/helpers/date";
import { format } from "date-fns";
import { CalendarDays, CheckCircle, Clock, Cross, House, Mail, User } from "lucide-react";
import { useNextStep } from "nextstepjs";

interface AppointmentConfirmationCardProps {
  doctor: DoctorModel;
  slot: {
    date: string;
    hour: string;
    duration: number;
  };
  patient: PatientModel;
  appointmentId: string;
  onHomeClick: () => void;
}

export function AppointmentConfirmationCard({
  doctor,
  patient,
  slot,
  appointmentId,
  onHomeClick,
}: AppointmentConfirmationCardProps) {
  const { closeNextStep } = useNextStep();
  const dateBgColor = colorize(1);
  const hourBgColor = colorize(2);

  const idTypeLabel = patient && idLabels[patient?.identificationType];

  return (
    <article className="lg:flex-center flex flex-col gap-6 py-8">
      <header className="flex items-center justify-center gap-4 pl-1 pr-12 text-center">
        <CheckCircle className="h-7 w-7 flex-shrink-0 text-green-400" />
        <h2 className="text-2xl font-semibold">Appointment booked successfully</h2>
      </header>

      <section className="flex flex-col gap-6 lg:flex-row lg:justify-center">
        {/* Doctor image and name */}
        <AppointmentDoctorCard colorIndex={3} doctor={doctor} fixed={true} className="flex-1" />

        {/* Vertical Ruler */}
        <div className="inset-0 hidden items-center lg:flex">
          <span className="h-[70%] border-l-2 border-dashed"></span>
        </div>

        {/* Date and hour */}
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex w-full items-center gap-4 rounded-3xl p-5 pr-7 shadow">
            <div className={cn(dateBgColor, "w-fit rounded-2xl p-4")}>
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-gray">Date</h2>
              <p className="text-base font-medium">{format(slot.date, "PPP")}</p>
            </div>
          </div>
          <div className="flex w-full items-center gap-4 rounded-3xl p-5 pr-7 shadow">
            <div className={cn(hourBgColor, "w-fit rounded-2xl p-4")}>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-gray">Hour</h2>
              <p className="text-base font-medium">{slot.hour}</p>
            </div>
          </div>
        </div>

        {/* Vertical Ruler */}
        <div className="inset-0 hidden items-center lg:flex">
          <span className="h-[70%] border-l-2 border-dashed"></span>
        </div>

        {/* Patient info */}
        <div className="flex flex-col justify-center gap-6">
          {/* Personal details */}
          <div className="flex flex-col gap-1 rounded-3xl px-6 py-5 pr-7 shadow">
            <p className="mb-1 flex items-center font-semibold">
              <User className="mr-2 h-4 w-4" />
              {patient.name}
            </p>
            <p>
              <span className="mr-1 text-gray">Birthdate:</span> {displayDate(patient.birthdate)}{" "}
            </p>
            <p>
              <span className="mr-1 text-gray">Email:</span> {patient.email}
            </p>
            <p>
              <span className="mr-1 text-gray">Phone:</span> {patient.phone}
            </p>
            <p>
              <span className="mr-1 text-gray">{idTypeLabel}:</span>
              {patient.identificationNumber}
            </p>
          </div>

          {/* Insurance details */}
          <div className="flex flex-1 flex-col gap-1 rounded-3xl px-6 py-5 pr-7 shadow">
            <p className="mb-1 flex items-center font-semibold">
              <Cross className="mr-2 h-4 w-4" />
              {patient.insuranceProvider}
            </p>
            <p>
              <span className="mr-1 text-gray">Number:</span> {patient.insuranceNumber}
            </p>
          </div>
        </div>
      </section>

      <div
        className="mt-4 flex flex-col gap-4 lg:flex-row"
        id="step-email-calendar"
        onClick={() => closeNextStep()}
      >
        <Button variant="outline" onClick={onHomeClick}>
          <House />
          Back to Home
        </Button>
        <AppointmentSendEmailDialog appointmentId={appointmentId} />
        <AppointmentCalendarLink
          name={doctor.name}
          specialty={doctor.specialty}
          startTime={joinDateTime(slot.date, slot.hour)}
          duration={slot.duration}
        />
      </div>
    </article>
  );
}
