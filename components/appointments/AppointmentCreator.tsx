"use client";

import { DoctorSelector } from "@/components/appointments/create/DoctorSelector";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { useReducer } from "react";
import { SlotSelector } from "@/components/appointments/create/SlotSelector";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/shared/helpers/utils";
import { initialState, reducer } from "@/components/appointments/AppointmentCreatorReducer";

export default function AppointmentCreator({ doctors }: { doctors: DoctorModel[] | "error" }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  function onNextClick() {}

  if (doctors === "error") {
    return;
  }

  return (
    <>
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
    </>
  );
  // case 2:
  //   return (
  //     <PatientCreator
  //       doctor={doctor!}
  //       date={date}
  //       hour={hour}
  //       onBackClick={onBackClick}
  //       onCompletion={onPatientCreated}
  //     />
  //   );
  // case 3:
  //   return <div>Appointment booked.</div>;
}
