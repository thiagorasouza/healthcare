"use server";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { Button } from "@/components/ui/button";
import { getAppointment } from "@/server/actions/getAppointment";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditAppointmentPage({
  params,
}: {
  params: { appointmentId: string };
}) {
  const { appointmentId: id } = params;
  const appointmentResult = await getAppointment(objectToFormData({ id }));

  if (!appointmentResult.ok) {
    return <ErrorCard text="Appointment not found" />;
  }

  const ap = appointmentResult.value;

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <div className="mb-3 flex items-center justify-between">
        <AdminBreadcrumb replace={ap.id} />
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
        <AppointmentForm appointment={ap} />
      </DefaultCard>
    </div>
  );
}
