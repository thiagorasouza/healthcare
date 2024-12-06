"use client";

import { AppointmentView } from "@/components/appointments/AppointmentView";
import FormMessage from "@/components/forms/FormMessage";
import DateField from "@/components/forms/DateField";
import SubmitButton from "@/components/forms/SubmitButton";
import TextField from "@/components/forms/TextField";
import DefaultCard from "@/components/shared/DefaultCard";
import { Form } from "@/components/ui/form";
import { recoverAppointment } from "@/server/actions/recoverAppointment";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { recoverAppointmentSchema } from "@/server/adapters/zod/recoverAppointmentValidator";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { RecoverAppointmentRequest } from "@/server/useCases/recoverAppointment/recoverAppointmentUseCase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RecoverPage() {
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState<AppointmentHydrated[] | undefined>();

  const form = useForm<RecoverAppointmentRequest>({
    resolver: zodResolver(recoverAppointmentSchema),
    defaultValues: { email: "", birthdate: undefined },
  });

  async function onSubmit(data: RecoverAppointmentRequest) {
    setMessage("");
    try {
      const result = await recoverAppointment(objectToFormData(data));
      // console.log("🚀 ~ result:", result);
      if (!result.ok) {
        setMessage(
          result.error.code === "NotFoundFailure" ? "Appointment not found." : "Unexpected error.",
        );
        return;
      }

      setAppointments(result.value);
    } catch (error) {
      setMessage("Unexpected error.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <DefaultCard
        title="Recover Appointment Details"
        description="Type your email and birth date to view your appointment details"
      >
        {message && <FormMessage message={message} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, () => console.log(form.formState.errors))}>
            <div className="mb-6 flex gap-6">
              <TextField
                form={form}
                name="email"
                label="Email"
                placeholder="name@example.com"
                description="The email used for booking the appointment"
              />
              <DateField
                name="birthdate"
                label="Birthdate"
                placeholder="Pick your birthdate"
                form={form}
                className="flex-1"
              />
            </div>
            <SubmitButton form={form} label="Search" />
          </form>
        </Form>
      </DefaultCard>
      {appointments &&
        appointments.map((ap, index) => <AppointmentView key={index} appointment={ap} />)}
    </div>
  );
}
