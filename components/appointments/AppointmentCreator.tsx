"use client";

import { AppointmentDoctorSelector } from "@/components/appointments/AppointmentDoctorSelector";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { Dispatch, useState } from "react";
import { AppointmentSlotSelector } from "@/components/appointments/AppointmentSlotSelector";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { Action, State } from "@/components/appointments/AppointmentCreatorReducer";
import AppointmentSummaryCard from "@/components/appointments/AppointmentSummaryCard";
import { createAppointment } from "@/server/actions/createAppointment";
import PatientForm from "@/components/patients/PatientForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientModel } from "@/server/domain/models/patientModel";
import { ErrorDialog } from "@/components/shared/ErrorDialog";
import { displayError } from "@/server/config/errors";
import { joinDateTime } from "@/server/useCases/shared/helpers/date";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn, scrollToTop } from "@/lib/utils";
import { AppointmentConfirmationCard } from "@/components/appointments/AppointmentConfirmationCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SavingOverlay } from "@/components/shared/SavingOverlay";
import { AppointmentLanding } from "@/components/appointments/AppointmentLanding";
import { saveAppointmentLS } from "@/lib/actions/localStorage";
import {
  patientDefaultValues,
  PatientFormData,
  patientFormSchema,
} from "@/server/adapters/zod/patientValidator";

interface AppointmentCreatorProps {
  doctors: DoctorModel[];
  state: State;
  dispatch: Dispatch<Action>;
}

export default function AppointmentCreator({ doctors, state, dispatch }: AppointmentCreatorProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: state.patientFormSave || patientDefaultValues,
  });

  function onStartClick() {
    dispatch({ type: "start" });
  }

  async function onDoctorClick(doctor: DoctorModel) {
    if (state.phase === "date_selection" && state.doctor.id === doctor.id) {
      dispatch({ type: "remove_doctor" });
      return;
    }

    try {
      setLoading(true);
      const startDate = new Date();
      const slotsResult = await getSlots(objectToFormData({ doctorId: doctor.id, startDate }));

      if (slotsResult.ok) {
        // console.log("slotsResult", slotsResult);
        dispatch({ type: "set_doctor", payload: { doctor, slots: slotsResult.value } });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function onDateClick(date: string) {
    dispatch({ type: "set_date", payload: { date } });
  }

  function onHourClick(hour: string, duration: number) {
    dispatch({ type: "set_hour_duration", payload: { hour, duration } });
    scrollToTop();
  }

  function onBackClick() {
    setMessage("");

    switch (state.phase) {
      case "patient_creation":
        dispatch({
          type: "back_to_hour_selection",
          payload: {
            patientFormSave: form.getValues(),
          },
        });
        break;
      case "summary":
        dispatch({ type: "back_to_patient_creation" });
        break;
    }
  }

  function onPatientSaved(patient: PatientModel) {
    dispatch({ type: "show_summary", payload: { patient } });
  }

  async function onBookClick() {
    if (state.phase !== "summary") return;

    setLoading(true);
    setMessage("");
    try {
      const doctorId = state.doctor.id;
      const patientId = state.patient.id;
      const startTime = joinDateTime(state.slot.date, state.slot.hour);
      const duration = state.slot.duration;

      const createAppointmentResult = await createAppointment(
        objectToFormData({ doctorId, patientId, startTime, duration }),
      );
      console.log("🚀 ~ onBookClick ~ createAppointmentResult:", createAppointmentResult);

      if (!createAppointmentResult.ok) {
        setMessage(displayError(createAppointmentResult));
        return;
      }

      const appointmentId = createAppointmentResult.value.id;

      saveAppointmentLS({
        id: appointmentId,
        patient: state.patient,
        doctor: state.doctor,
        ...state.slot,
      });

      dispatch({
        type: "show_confirmation",
        payload: { appointmentId: createAppointmentResult.value.id },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function onHomeClick() {
    dispatch({ type: "reset" });
  }

  if (state.phase === "initial") {
    return <AppointmentLanding onStartClick={onStartClick} />;
  }

  if (
    state.phase === "doctor_selection" ||
    state.phase === "date_selection" ||
    state.phase === "hour_selection"
  ) {
    return (
      <div className="flex flex-col gap-10 pb-8 pt-10">
        <AppointmentDoctorSelector
          doctors={doctors}
          doctor={state.doctor}
          onDoctorClick={onDoctorClick}
        />
        {loading ? (
          <div className="flex justify-center py-32">
            <LoadingSpinner />
          </div>
        ) : (
          // <div className="flex justify-center">Loading...</div>
          state.doctor &&
          state.slots && (
            <AppointmentSlotSelector
              doctor={state.doctor}
              slots={state.slots}
              slot={state.slot}
              onDateClick={onDateClick}
              onHourClick={onHourClick}
            />
          )
        )}
      </div>
    );
  }

  if (state.phase === "patient_creation") {
    return (
      <div className="md:py-3 xl:py-4">
        <Header title="Patient" onBackClick={onBackClick} className="mb-2" />
        <div className="flex flex-col gap-4 xl:flex-row">
          <AppointmentSummaryCard
            doctor={state.doctor}
            slot={state.slot}
            onBookClick={onBookClick}
            className="hidden px-1 md:px-3 xl:block"
          />
          <div className="relative flex-grow p-2 xl:p-6">
            <PatientForm mode="create" form={form} onPatientSaved={onPatientSaved} />
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === "summary") {
    return (
      <div className="md:py-3 md:pb-5 xl:py-4 xl:pb-7">
        {loading && <SavingOverlay />}
        <Header title="Summary" onBackClick={onBackClick} />
        <ErrorDialog message={message} setMessage={setMessage} />
        <AppointmentSummaryCard
          doctor={state.doctor}
          slot={state.slot}
          patient={state.patient}
          onBookClick={onBookClick}
          className="px-1 md:px-3"
        />
      </div>
    );
  }

  if (state.phase === "confirmation") {
    return (
      <AppointmentConfirmationCard
        doctor={state.doctor}
        slot={state.slot}
        patient={state.patient}
        appointmentId={state.appointmentId}
        onHomeClick={onHomeClick}
      />
    );
  }
}

interface HeaderProps {
  title: string;
  onBackClick: () => void;
  className?: string;
}

export function Header({ title, onBackClick, className }: HeaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" className="aspect-square rounded-full p-2" onClick={onBackClick}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
