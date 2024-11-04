"use server";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import DefaultCard from "@/components/shared/DefaultCard";
import { Button } from "@/components/ui/button";
import { listAppointments } from "@/server/actions/listAppointments";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AppointmentsPage() {
  const appointmentsResult = await listAppointments();
  const appointments = appointmentsResult.ok ? appointmentsResult.value : "error";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminBreadcrumb />
        <Button size="sm" className="ml-auto h-8 w-fit">
          <Link href="/admin/appointments/create" className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">Add Appointment</span>
          </Link>
        </Button>
      </div>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
