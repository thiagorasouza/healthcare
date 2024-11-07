"use client";

import { DoctorSelector } from "@/components/appointments/create/DoctorSelector";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { useReducer, useState } from "react";
import { SlotSelector } from "@/components/appointments/create/SlotSelector";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/shared/helpers/utils";
import { initialState, reducer } from "@/components/appointments/AppointmentCreatorReducer";
import { PatientCreator } from "@/components/appointments/create/PatientCreator";
import { PatientParsedData } from "@/lib/schemas/patientsSchema";
import DefaultCard from "@/components/shared/DefaultCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageLink } from "@/lib/actions/getImageLink";
import { getInitials, scrollToTop } from "@/lib/utils";
import { ArrowUpRight, CalendarDays, CircleUserRound, Clock, Hourglass } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppointmentCreator({ doctors }: { doctors: DoctorModel[] | "error" }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPatientCreator, setShowPatientCreator] = useState(false);
  const [booked, setBooked] = useState(false);
  const [patientData, setPatientData] = useState<PatientParsedData | undefined>();

  async function onDoctorClick(doctor: DoctorModel) {
    if (state.phase === "date_selection" && state.doctor.id === doctor.id) {
      dispatch({ type: "remove_doctor" });
      return;
    }

    const slotsResult = await getSlots(
      objectToFormData({ doctorId: doctor.id, startDate: new Date() }),
    );

    if (!slotsResult.ok) {
      dispatch({ type: "slots_error" });
      return;
    }

    dispatch({ type: "set_doctor", payload: { doctor, slots: slotsResult.value } });
  }

  function onDateClick(date: string) {
    dispatch({ type: "set_date", payload: { date } });
  }

  function onHourClick(hour: string, duration: number) {
    dispatch({ type: "set_hour_duration", payload: { hour, duration } });
  }

  function onNextClick() {
    setShowPatientCreator(true);
    scrollToTop();
  }

  function onBooked(patientData: PatientParsedData) {
    setBooked(true);
    setPatientData(patientData);
  }

  if (doctors === "error") {
    return;
  }

  if (booked) {
    return (
      <DefaultCard
        title="Appointment Booked"
        description="Your appointment was booked successfully"
        className="col-span-4 self-start"
      >
        <div className="mb-8 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={getImageLink(state.doctor!.pictureId)} />
            <AvatarFallback>{getInitials(state.doctor!.name)}</AvatarFallback>
          </Avatar>
          <div className="font-semibold">
            <p className="text-lg">{`Dr. ${state.doctor!.name}`}</p>
            <p className="text-sm text-gray">{state.doctor!.specialty}</p>
          </div>
          <div>
            <p></p>
          </div>
        </div>
        <div className="mb-8 flex items-center gap-3 self-start">
          <div>
            <CircleUserRound className="h-9 w-9" />
          </div>
          <div>
            <p className="font-semibold">{patientData!.name}</p>
            <p className="text-sm">
              {patientData!.email} | {patientData!.phone}
            </p>
          </div>
        </div>
        <div className="mb-8 space-y-2 text-sm">
          <p className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4" />
            {format(new Date(state.slot.date!), "PPP")}
          </p>
          <p className="flex items-center gap-3">
            <Clock className="h-4 w-4" />
            {state.slot.hour}
          </p>
          <p className="flex items-center gap-3">
            <Hourglass className="h-4 w-4" />
            {state.slot.duration} minutes
          </p>
        </div>
        {/* <Button asChild>
          <Link href="/admin/appointments" className="flex items-center">
            <ArrowUpRight className="h-4 w-4" /> View All Appointments
          </Link>
        </Button> */}
      </DefaultCard>
    );
  }

  return !showPatientCreator ? (
    <div className="flex flex-col gap-10">
      <DoctorSelector doctors={doctors} doctor={state.doctor} onDoctorClick={onDoctorClick} />
      {state.doctor && state.slots && (
        <SlotSelector
          doctor={state.doctor}
          slots={state.slots}
          slot={state.slot}
          onDateClick={onDateClick}
          onHourClick={onHourClick}
          onNextClick={onNextClick}
        />
      )}
    </div>
  ) : (
    <PatientCreator
      doctor={state.doctor!}
      date={state.slot!.date}
      hour={{ hour: state.slot.hour!, duration: state.slot.duration! }}
      onBooked={onBooked}
    />
  );
}
