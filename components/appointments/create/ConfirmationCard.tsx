import { DoctorCard } from "@/components/appointments/create/DoctorCard";
import SendEmailDialog from "@/components/appointments/create/SendEmailDialog";
import { Button } from "@/components/ui/button";
import { cn, colorize } from "@/lib/utils";
import { idLabels } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";
import { displayDate } from "@/server/shared/helpers/date";
import { format } from "date-fns";
import { CalendarDays, CheckCircle, Clock, Cross, House, Mail, User } from "lucide-react";
import Link from "next/link";

interface ConfirmationCardProps {
  doctor: DoctorModel;
  slot: {
    date: string;
    hour: string;
    duration: number;
  };
  patient: PatientModel;
}

export function ConfirmationCard({ doctor, patient, slot }: ConfirmationCardProps) {
  const dateBgColor = colorize(1);
  const hourBgColor = colorize(2);

  const idTypeLabel = patient && idLabels[patient?.identificationType];

  return (
    <article className="flex-center gap-14 pb-4 pt-10">
      <header className="flex gap-4">
        <CheckCircle className="h-7 w-7 text-green-400" />
        <h2 className="text-2xl font-semibold">Appointment booked successfully</h2>
      </header>

      <section className="flex justify-center gap-8">
        {/* Doctor image and name */}
        <DoctorCard colorIndex={3} doctor={doctor} fixed={true} className="flex-1" />

        {/* Vertical Ruler */}
        <div className="inset-0 flex items-center self-stretch">
          <span className="h-full border-l-2 border-dashed"></span>
        </div>

        {/* Date and hour */}
        <div className="flex flex-1 flex-col justify-center gap-4 pt-4">
          <div className="flex w-fit items-center gap-4 rounded-3xl p-5 pr-7 shadow">
            <div className={cn(dateBgColor, "w-fit rounded-2xl p-4")}>
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-gray">Date</h2>
              <p className="text-base font-medium">{format(slot.date, "PPP")}</p>
            </div>
          </div>
          <div className="flex w-fit items-center gap-4 rounded-3xl p-5 pr-7 shadow">
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
        <div className="inset-0 flex items-center self-stretch">
          <span className="h-full border-l-2 border-dashed"></span>
        </div>

        {/* Patient info */}
        <div className="flex flex-col justify-center gap-4">
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

      <div className="flex gap-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <House />
            Back to Home
          </Link>
        </Button>
        <SendEmailDialog />
      </div>
    </article>
  );
}
