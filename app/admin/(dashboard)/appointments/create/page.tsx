"use server";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import DefaultCard from "@/components/shared/DefaultCard";

export default async function CreateAppointmentPage() {
  return (
    <div className="mx-auto w-full max-w-[600px] space-y-4">
      <AdminBreadcrumbWithBackLink backLink="/admin/appointments" />
      <DefaultCard
        title="Create Appointment"
        description="Add a new appointment for an existing patient"
      >
        <AppointmentForm mode="create" />
      </DefaultCard>
    </div>
  );
}
