"use client";

import AppointmentsForm from "@/components/appointments/AppointmentsForm";
import { Button } from "@/components/ui/button";
import { createAppointment } from "@/lib/actions/createAppointment";
import { deleteAppointment } from "@/lib/actions/deleteAppointment";
import { getDoctorAppointments } from "@/lib/actions/getDoctorAppointments";
import { AppointmentsStoredData } from "@/lib/schemas/appointmentsSchema";
import { formatDate } from "@/lib/utils";
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface AppointmentFormData {
  doctorId: string;
  patientId: string;
  patternId: string;
  startTime: Date;
}

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentsStoredData>();

  async function loadAppointments() {
    const doctorId = "66d64f2c002f4ffd52f0";
    const result = await getDoctorAppointments(doctorId);
    if (result.success) {
      setAppointments(result.data);
    } else {
      toast("Unable to load appointments at this time.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    loadAppointments();
  }, []);

  async function onDeleteClick(appointmentId: string) {
    const result = await deleteAppointment(appointmentId);
    if (result.success) {
      toast(`Appointment ${appointmentId} deleted successfully.`);
      loadAppointments();
    } else {
      toast(`Unable to delete appointment ${appointmentId}.`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Appointments</h1>
      {appointments ? (
        <ul className="flex flex-col gap-2">
          {appointments.documents.map((appointment, index) => (
            <li className="flex items-center gap-2" key={index}>
              {formatDate(new Date(appointment.startTime))}
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/appointments/${appointment.$id}`}>
                  <SquarePen className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteClick(appointment.$id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No appointments created</div>
      )}
      <AppointmentsForm mode="create" action={createAppointment} onSuccess={loadAppointments} />
    </div>
  );
}
