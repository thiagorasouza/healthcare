import { DoctorCard } from "@/components/appointments/create/DoctorCard";
import BackButton from "@/components/shared/BackButton";
import DefaultCard from "@/components/shared/DefaultCard";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getImageLink } from "@/lib/actions/getImageLink";
import { PatientParsedData } from "@/lib/schemas/patientsSchema";
import { cn, colorize, getInitials } from "@/lib/utils";
import { idLabels } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { displayDate } from "@/server/shared/helpers/date";
import { format } from "date-fns";

import { ArrowLeft, ArrowRight, CalendarDays, Clock, Cross, User } from "lucide-react";

interface SummaryCardProps {
  doctor: DoctorModel;
  slot: {
    date: string;
    hour: string;
    duration: number;
  };
  patient?: PatientParsedData;
  onBookClick: () => void;
  onBackClick: (from: "patient_creation" | "summary") => void;
}

export default function SummaryCard({
  doctor,
  slot,
  patient,
  onBookClick,
  onBackClick,
}: SummaryCardProps) {
  const dateBgColor = colorize(1);
  const hourBgColor = colorize(2);

  const idTypeLabel = patient && idLabels[patient?.identificationType];

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          className="aspect-square rounded-full p-2"
          onClick={() => onBackClick(patient ? "summary" : "patient_creation")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Summary</h1>
      </div>
      <div className="grid grid-cols-12 items-start gap-6">
        <div className="col-span-3 flex flex-col gap-4">
          <h2 className="text-xl font-medium text-gray">Appointment</h2>
          <DoctorCard colorIndex={3} doctor={doctor} fixed={true} className="" />
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
          {/* <BackButton label="Change" /> */}
        </div>
        {patient && (
          <DrawerAnimation mode="horizontal" toggle={!!patient} className="col-span-9 self-stretch">
            <div className="flex h-full flex-col gap-5">
              <h2 className="text-xl font-medium text-gray">Patient</h2>
              <div className="flex flex-col gap-1 rounded-3xl px-6 py-5 pr-7 shadow">
                <p className="mb-1 flex items-center font-semibold">
                  <User className="mr-2 h-4 w-4" />
                  {patient.name}
                </p>
                <p>
                  <span className="mr-1 text-gray">Birthdate:</span>{" "}
                  {displayDate(patient.birthdate)}{" "}
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
              <h2 className="text-xl font-medium text-gray">Insurance</h2>
              <div className="flex flex-col gap-1 rounded-3xl px-6 py-5 pr-7 shadow">
                <p className="mb-1 flex items-center font-semibold">
                  <Cross className="mr-2 h-4 w-4" />
                  {patient.insuranceProvider}
                </p>
                <p>
                  <span className="mr-1 text-gray">Number:</span> {patient.insuranceNumber}
                </p>
              </div>
              <div
                className="group mt-auto flex h-[50px] w-full cursor-pointer items-center justify-end gap-[16px] self-end rounded-full bg-black p-[5px] transition hover:bg-darker-purple"
                onClick={onBookClick}
              >
                <div className="flex-1 text-center text-[18px] font-medium text-white transition duration-300">
                  Confirm & Book
                </div>
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white">
                  <ArrowRight className="h-[19px] w-[19px] text-black transition group-hover:text-darker-purple" />
                </div>
              </div>
            </div>
          </DrawerAnimation>
        )}
      </div>
    </>
  );
}
