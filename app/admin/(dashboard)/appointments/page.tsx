"use server";

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AppointmentsCard } from "@/components/appointments/AppointmentsCard";

export default async function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <AppointmentsCard />
    </div>
  );
}
