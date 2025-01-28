import DateField from "@/components/forms/DateField";
import ErrorMessage from "@/components/forms/ErrorMessage";
import SubmitButton from "@/components/forms/SubmitButton";
import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import { AppointmentPublicData } from "@/lib/localStorage";
import { objectToFormData } from "@/lib/utils";
import { findAppointment } from "@/server/actions/findAppointment";
import {
  FindAppointmentFormData,
  findAppointmentForm,
} from "@/server/adapters/zod/findAppointmentValidator";
import { displayError } from "@/server/config/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function FindAppointmentForm({
  onFound,
}: {
  onFound: (appointments: AppointmentPublicData[]) => void;
}) {
  const [message, setMessage] = useState("");

  const form = useForm<FindAppointmentFormData>({
    resolver: zodResolver(findAppointmentForm),
    defaultValues: { email: "", birthdate: undefined },
  });

  async function onSubmit(data: FindAppointmentFormData) {
    setMessage("");
    try {
      const findResult = await findAppointment(objectToFormData(data));
      console.log("🚀 ~ findResult:", findResult);

      if (!findResult.ok) {
        setMessage(displayError(findResult));
        return;
      }

      const apNum = findResult.value.length;
      setMessage(`Found ${apNum} matching appointment${apNum > 1 ? "s" : ""}`);
      onFound(findResult.value);
    } catch (error) {
      console.log(error);
      setMessage(displayError());
    }
  }

  return (
    <Form {...form}>
      <ErrorMessage message={message} />
      <form onSubmit={form.handleSubmit(onSubmit, () => console.log(form.formState.errors))}>
        <div className="mb-6 flex gap-6">
          <TextField form={form} name="email" label="Email" placeholder="name@example.com" />
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
  );
}
