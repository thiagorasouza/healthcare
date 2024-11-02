"use client";

import { DoctorSelector } from "@/components/appointments/create/DoctorSelector";
import { PatientCreator } from "@/components/appointments/create/PatientCreator";
import { Slots } from "@/lib/processing/getSlots";
import { PatientParsedData } from "@/lib/schemas/patientsSchema";
import { scrollToTop } from "@/lib/utils";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { set } from "date-fns";
import { useState } from "react";

interface AppointmentCreatorProps {
  doctors: DoctorModel[] | "error";
}

export default function AppointmentCreator({ doctors }: AppointmentCreatorProps) {
  const [doctor, setDoctor] = useState<DoctorModel | undefined>();
  const [patient, setPatient] = useState<PatientParsedData | undefined>();
  const [slots, setSlots] = useState<Slots | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const [hour, setHour] = useState<{ hour: string; duration: number } | undefined>();
  const [step, setStep] = useState<number>(1);

  function onDoctorSelected(
    doctor: DoctorModel,
    slots: Slots,
    date: string,
    hour: string,
    duration: number,
  ) {
    setDoctor(doctor);
    setSlots(slots);
    setDate(date);
    setHour({ hour, duration });
    setStep(2);
  }

  function onPatientCreated(patient: PatientParsedData) {
    setPatient(patient);
    setStep(3);
  }

  function onBackClick() {
    setStep(1);
    scrollToTop();
  }

  if (doctors === "error") {
    return;
  }

  switch (step) {
    case 1:
      return (
        <DoctorSelector
          doctors={doctors}
          doctor={doctor}
          slots={slots}
          date={date}
          hour={hour}
          onCompletion={onDoctorSelected}
        />
      );
    case 2:
      return (
        <PatientCreator
          doctor={doctor!}
          date={date}
          hour={hour}
          onBackClick={onBackClick}
          onCompletion={onPatientCreated}
        />
      );
    case 3:
      return <div>Appointment booked.</div>;
  }
}
