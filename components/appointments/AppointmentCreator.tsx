"use client";

import { DoctorSelector } from "@/components/appointments/create/DoctorSelector";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { Dispatch } from "react";
import { SlotSelector } from "@/components/appointments/create/SlotSelector";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/shared/helpers/utils";
import { Action, State } from "@/components/appointments/AppointmentCreatorReducer";
import {
  PatientParsedData,
  patientsZodSchema,
  PatientZodData,
  patientZodDefaultValues,
} from "@/lib/schemas/patientsSchema";
import SummaryCard from "@/components/appointments/create/SummaryCard";
import { set } from "date-fns";
import { createAppointment } from "@/server/actions/createAppointment";
import PatientsForm from "@/components/patients/PatientsForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPatient } from "@/lib/actions/createPatient";

interface AppointmentCreatorProps {
  doctors: DoctorModel[] | "error";
  state: State;
  dispatch: Dispatch<Action>;
}

export default function AppointmentCreator({ doctors, state, dispatch }: AppointmentCreatorProps) {
  const form = useForm<PatientZodData>({
    resolver: zodResolver(patientsZodSchema),
    defaultValues: state.patientFormSave || patientZodDefaultValues,
  });

  async function onDoctorClick(doctor: DoctorModel) {
    if (state.phase === "date_selection" && state.doctor.id === doctor.id) {
      dispatch({ type: "remove_doctor" });
      return;
    }

    const slotsResult = await getSlots(
      objectToFormData({ doctorId: doctor.id, startDate: new Date() }),
    );

    if (!slotsResult.ok) {
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

  function onBackClick(from: "patient_creation" | "summary") {
    if (from === "summary") {
      dispatch({ type: "back_to_patient_creation" });
    }
    if (from === "patient_creation") {
      dispatch({
        type: "back_to_hour_selection",
        payload: {
          patientFormSave: form.getValues(),
        },
      });
    }
  }

  function onPatientCreated(patient: PatientParsedData) {
    dispatch({ type: "show_summary", payload: { patient } });
  }

  async function onBookClick() {
    if (state.phase !== "summary") return;

    try {
      const doctorId = state.doctor.id;
      const patientId = state.patient.$id;

      const [hours, minutes] = state.slot.hour.split(":").map((x) => Number(x));
      const startTime = set(new Date(state.slot.date), {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      });

      const duration = state.slot.duration;

      const result = await createAppointment(
        objectToFormData({ doctorId, patientId, startTime, duration }),
      );
      console.log("🚀 ~ result:", result);
    } catch (error) {
      console.log(error);
    }
  }

  function onBooked(patientData: PatientParsedData) {
    dispatch({ type: "show_summary", payload: { patient: patientData } });
  }

  if (doctors === "error") {
    return;
  }

  if (
    state.phase === "doctor_selection" ||
    state.phase === "date_selection" ||
    state.phase === "hour_selection"
  ) {
    return (
      <div className="flex flex-col gap-10">
        <DoctorSelector doctors={doctors} doctor={state.doctor} onDoctorClick={onDoctorClick} />
        {state.doctor && state.slots && (
          <SlotSelector
            doctor={state.doctor}
            slots={state.slots}
            slot={state.slot}
            onDateClick={onDateClick}
            onHourClick={onHourClick}
          />
        )}
      </div>
    );
  }

  if (state.phase === "patient_creation") {
    return (
      <div className="flex gap-8">
        <SummaryCard
          title="Patient"
          doctor={state.doctor}
          slot={state.slot}
          onBookClick={onBookClick}
          onBackClick={onBackClick}
        />
        <PatientsForm
          form={form}
          action={createPatient}
          onSuccess={onPatientCreated}
          submitLabel="Save"
        />
      </div>
    );
  }

  if (state.phase === "summary") {
    return (
      <SummaryCard
        doctor={state.doctor}
        slot={state.slot}
        patient={state.patient}
        onBookClick={onBookClick}
        onBackClick={onBackClick}
      />
    );
  }

  if (state.phase === "confirmation") {
    return <div>Confirmation</div>;
  }
}
