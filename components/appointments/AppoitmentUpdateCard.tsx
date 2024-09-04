"use client";

import AppointmentsForm from "@/components/appointments/AppointmentsForm";
import DefaultCard from "@/components/shared/DefaultCard";
import { updateAppointment } from "@/lib/actions/updateAppointment";
import { AppointmentParsedData } from "@/lib/schemas/appointmentsSchema";

export default function AppointmentUpdateCard({ data }: { data: AppointmentParsedData }) {
  function onSuccess(data: AppointmentParsedData) {
    console.log("🚀 ~ data:", data);
  }

  return (
    <DefaultCard title="Update Appointment" description="Change appointment details">
      <AppointmentsForm
        mode="update"
        data={data}
        action={updateAppointment}
        onSuccess={onSuccess}
      />
    </DefaultCard>
  );
}
