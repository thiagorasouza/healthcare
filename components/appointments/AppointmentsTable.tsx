"use client";

import ErrorCard from "@/components/shared/ErrorCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteDialog } from "@/lib/hooks/useDeleteDialog";
import { deleteAppointment } from "@/server/actions/deleteAppointment.bypass";
import { listAppointments } from "@/server/actions/listAppointments";
import { displayError } from "@/server/config/errors";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { displayDate, displayDuration, displayTime } from "@/server/useCases/shared/helpers/date";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { PlusCircle, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AppointmentsTable() {
  const { openDeleteDialog, deleteDialog } = useDeleteDialog(handleDelete);
  const [appointments, setAppointments] = useState<AppointmentHydrated[] | "error">();

  const loading = appointments === undefined;
  const error = appointments === "error";
  const empty = appointments?.length === 0;

  async function loadAppointments() {
    try {
      const result = await listAppointments();
      if (!result.ok) {
        setAppointments("error");
      } else {
        setAppointments(result.value);
      }
    } catch (error) {
      console.log(error);
      setAppointments("error");
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleDelete(id: string) {
    try {
      const deleteResult = await deleteAppointment(objectToFormData({ id }));
      if (!deleteResult.ok) {
        toast(displayError(deleteResult));
        return;
      }

      toast(`Appointment deleted successfully.`);
      loadAppointments();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  } else if (empty) {
    return (
      <>
        <p>No appointments yet.</p>
        <Button asChild className="mt-6">
          <Link href="/admin/appointments/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Link>
        </Button>
      </>
    );
  } else if (error) {
    return (
      <ErrorCard text="Unable to query for appointments at this time. Please try again later." />
    );
  }

  return (
    <>
      {deleteDialog}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    openDeleteDialog({
                      id: ap.id,
                      description: `${ap.patient.name}'s appointment`,
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/admin/appointments/${ap.id}`}>
                    <SquarePen className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
