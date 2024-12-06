import { DoctorCard } from "@/components/appointments/create/DoctorCard";
import SubmitButton from "@/components/forms/SubmitButton";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { Button } from "@/components/ui/button";
import { cn, colorize } from "@/lib/utils";
import { idLabels } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";
import { displayDate } from "@/server/useCases/shared/helpers/date";
import { format } from "date-fns";

import { ArrowRight, CalendarDays, Clock, Cross, User } from "lucide-react";

interface SummaryCardProps {
  doctor: DoctorModel;
  slot: {
    date: string;
    hour: string;
    duration: number;
  };
  patient?: PatientModel;
  onBookClick: () => void;
  className?: string;
}

export default function SummaryCard({
  doctor,
  slot,
  patient,
  onBookClick,
  className,
}: SummaryCardProps) {
  const dateBgColor = colorize(1);
  const hourBgColor = colorize(2);

  const idTypeLabel = patient && idLabels[patient?.identificationType];

  return (
    <div className={className}>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex flex-col gap-8 pt-5">
          {/* Doctor name and picture */}
          <div>
            {patient && <h2 className="text-xl font-medium text-gray">Doctor</h2>}
            <DoctorCard colorIndex={3} doctor={doctor} fixed={true} className="" />
          </div>

          {/* Date and hour */}
          <div className="flex flex-col gap-4">
            {patient && <h2 className="text-xl font-medium text-gray">Appointment</h2>}
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
        </div>

        {patient && (
          // <DrawerAnimation mode="horizontal" toggle={!!patient} className="flex-1">
          <div className="flex flex-col gap-8 pt-5 md:flex-1">
            {/* Patient details */}
            <div className="flex flex-col gap-4">
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
            </div>

            {/* Insurance details */}
            <div className="flex flex-col gap-4">
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
            </div>

            <Button onClick={onBookClick}>Confirm & Book</Button>
            {/* <div
              className="group mt-auto flex h-[50px] w-full cursor-pointer items-center justify-end gap-[16px] self-end rounded-full bg-black p-[5px] transition hover:bg-darker-purple"
              
            >
              <div className="flex-1 text-center text-[18px] font-medium text-white transition duration-300">
                
              </div>
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white">
                <ArrowRight className="h-[19px] w-[19px] text-black transition group-hover:text-darker-purple" />
              </div>
            </div> */}
          </div>
          // </DrawerAnimation>
        )}
      </div>
    </div>
  );
}
