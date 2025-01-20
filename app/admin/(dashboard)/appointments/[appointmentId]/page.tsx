"use client";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAppointment } from "@/server/actions/getAppointment";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { useEffect, useState } from "react";

export default function EditAppointmentPage({ params }: { params: { appointmentId: string } }) {
  const { appointmentId } = params;
  const [appointment, setAppointment] = useState<AppointmentHydrated | "error">();

  async function loadAppointment() {
    try {
      const appointmentResult = await getAppointment(objectToFormData({ id: appointmentId }));
      if (!appointmentResult.ok) {
        setAppointment("error");
        return;
      }
      setAppointment(appointmentResult.value);
    } catch (error) {
      console.log(error);
      setAppointment("error");
    }
  }

  const loading = !appointment;
  const error = appointment === "error";

  useEffect(() => {
    loadAppointment();
  }, []);

  if (error) {
    return <ErrorCard text="Appointment not found" />;
  }

  return (
    <div className="mx-auto w-full max-w-[600px] space-y-6">
      <AdminBreadcrumbWithBackLink replace={appointmentId} backLink="/admin/appointments" />
      <DefaultCard
        title="Edit Appointment"
        description="Change appointment details, select another doctor or patient"
      >
        {loading ? (
          <LoadingSpinner size={24} className="mx-auto" />
        ) : (
          <AppointmentForm mode="update" appointment={appointment} />
        )}
      </DefaultCard>
    </div>
  );
}
