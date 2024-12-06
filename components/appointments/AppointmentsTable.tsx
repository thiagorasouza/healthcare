"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { ReactNode } from "react";
import ErrorCard from "@/components/shared/ErrorCard";
import { displayDate, displayDuration, displayTime } from "@/server/useCases/shared/helpers/date";
import { deleteAppointment } from "@/server/actions/deleteAppointment.bypass";
import { objectToFormData } from "@/lib/utils";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

interface AppointmentTableProps {
  appointments: AppointmentHydrated[] | "error";
}

export default function AppointmentsTable({ appointments }: AppointmentTableProps) {
  // console.log("🚀 ~ appointments:", appointments);
  const router = useRouter();
  const pathname = usePathname();
  const hasError = appointments === "error";

  async function onDeleteClick(id: string) {
    try {
      const deleteResult = await deleteAppointment(objectToFormData({ id }));
      if (!deleteResult.ok) {
        toast(`Unable to delete appointment ${id}.`);
        return;
      }

      toast(`Appointment ${id} deleted successfully.`);
      router.push(pathname);
    } catch (error) {
      console.log(error);
      toast("Unexpected error while deleting appointment");
    }
  }

  function onEditClick(id: string) {
    router.push(`/admin/appointments/${id}`);
  }

  if (hasError) {
    return (
      <ErrorCard text="Unable to query for appointments at this time. Please try again later." />
    );
  }

  const noAppointments = appointments.length === 0;
  if (noAppointments) {
    return (
      <Structure>
        <p>No appointments yet.</p>
        <Button asChild className="mt-6">
          <Link href="/admin/appointments/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Link>
        </Button>
      </Structure>
    );
  }

  return (
    <Structure>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((ap) => (
            <TableRow key={ap.id}>
              <TableCell>
                <div className="font-medium">{ap.doctor.name}</div>
                <div className="hidden text-xs text-muted-foreground md:inline">
                  {ap.doctor.specialty}
                </div>
              </TableCell>
              <TableCell>{ap.patient.name}</TableCell>
              <TableCell>{displayDate(ap.startTime)}</TableCell>
              <TableCell>{displayTime(ap.startTime)}</TableCell>
              <TableCell>{displayDuration(ap.duration)}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="destructive" onClick={() => onDeleteClick(ap.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                {/* <Button size="sm" onClick={() => onEditClick(ap.id)}>
                  <SquarePen className="h-4 w-4" />
                  Edit
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Structure>
  );
}

function Structure({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>Recently scheduled appointments</CardDescription>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}
