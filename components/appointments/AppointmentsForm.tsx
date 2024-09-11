"use client";

import AlertMessage from "@/components/forms/AlertMessage";
import { AppointmentParsedData } from "@/lib/schemas/appointmentsSchema";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface FormProps {
  action: (form: FormData) => Promise<any>;
  onSuccess: (data: AppointmentParsedData) => void;
  mode: "create" | "update";
  data?: AppointmentParsedData;
}

interface CreateFormProps extends FormProps {
  mode: "create";
}

interface UpdateFormProps extends FormProps {
  mode: "update";
  data: AppointmentParsedData;
}

export default function AppointmentsForm({
  mode,
  data,
  action,
  onSuccess,
}: CreateFormProps | UpdateFormProps) {
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setMessage("");
    try {
      if (mode === "update") {
        formData.append("appointmentId", data.$id);
      }

      const result = await action(formData);
      if (!result?.success || !result.data) {
        setMessage(result.message);
        return;
      }

      const datetime = formatDate(result.data.startTime);
      toast(`Appointment ${result.data.$id} for ${datetime} ${mode}d successfully.`);
      onSuccess(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-2">
      <AlertMessage message={message} />
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
        <button type="submit" className="bg-gray-400 border border-black px-2 py-1">
          Submit
        </button>
      </div>
    </form>
  );
}
