"use client";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAppointment } from "@/server/actions/getAppointment";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
    <div className="mx-auto w-full max-w-[600px]">
      <div className="mb-3 flex items-center justify-between">
        <AdminBreadcrumb replace={appointmentId} />
        <Button variant="outline">
          <Link href="/admin" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <DefaultCard
        title="Edit Appointment"
        description="Change appointment details, select another doctor or patient"
      >
        {loading ? (
          <LoadingSpinner size={24} className="mx-auto" />
        ) : (
          <AppointmentForm appointment={appointment} />
        )}
      </DefaultCard>
    </div>
  );
}
