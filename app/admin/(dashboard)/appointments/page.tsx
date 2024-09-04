"use client";

import { Button } from "@/components/ui/button";
import { createAppointment } from "@/lib/actions/createAppointment";
import { getDoctorAppointments } from "@/lib/actions/getDoctorAppointments";
import { AppointmentsStoredData } from "@/lib/schemas/appointmentsSchema";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface AppointmentFormData {
  doctorId: string;
  patientId: string;
  patternId: string;
  startTime: Date;
}

export default function AppointmentsPage() {
  const [message, setMessage] = useState("");
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

  async function onSubmit(formData: FormData) {
    try {
      const result = await createAppointment(formData);
      if (!result?.success || !result.data) {
        setMessage(result.message);
        return;
      }

      const datetime = formatDate(result.data.startTime);
      toast(`Appointment for ${datetime} create successfully.`);
      loadAppointments();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAppointment(appointmentId: string) {
    console.log(`Requested to delete appointment ${appointmentId}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Appointments</h1>
      {message && <div className="font-semibold">{message}</div>}
      {appointments ? (
        <ul className="flex flex-col gap-2">
          {appointments.documents.map((appointment, index) => (
            <li className="flex items-center gap-2" key={index}>
              {formatDate(new Date(appointment.startTime))}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteAppointment(appointment.$id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No appointments created</div>
      )}
      <form action={onSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <label htmlFor="doctorId">DoctorId:</label>
          <input
            type="text"
            name="doctorId"
            id="doctorId"
            className="border border-black"
            defaultValue="66d64f2c002f4ffd52f0"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="patientId">PatientId:</label>
          <input
            type="text"
            name="patientId"
            id="patientId"
            className="border border-black"
            defaultValue="66d0ee4d0028f73a6565"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="patternId">PatternId:</label>
          <input
            type="text"
            name="patternId"
            id="patternId"
            className="border border-black"
            defaultValue="66d650b2003424ad753c"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="startTime">StartTime:</label>
          <input
            type="datetime-local"
            name="startTime"
            id="startTime"
            className="border border-black"
            defaultValue="2024-09-03T10:00"
          />
        </div>
        <div>
          <button type="submit" className="border border-black bg-gray-400 px-2 py-1">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
