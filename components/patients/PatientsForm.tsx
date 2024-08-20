"use client";

import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import {
  allowedFileTypes,
  maxFileSize,
  PatientFormData,
  patientDefaultValues,
  patientsSchema,
} from "@/lib/schemas/patientsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioField } from "@/components/forms/RadioField";
import SubmitButton from "@/components/forms/SubmitButton";
import { SelectField } from "@/components/forms/SelectField";
import { genderTypes, idTypes } from "@/lib/constants";
import FileField from "@/components/forms/FileField";
import { CheckboxField } from "@/components/forms/CheckboxField";
import AlertMessage from "@/components/forms/AlertMessage";
import { useState } from "react";
import { objectToFormData } from "@/lib/utils";
import { unexpectedError } from "@/lib/results";
import { CreatePatientResult, CreatePatientSuccess } from "@/lib/actions/createPatient";
import DateField from "@/components/forms/DateField";

interface PatientsFormProps {
  action: (form: FormData) => Promise<CreatePatientResult>;
  onSuccess: (data: CreatePatientSuccess) => void;
  submitLabel?: string;
}

export default function PatientsForm({
  action,
  onSuccess,
  submitLabel = "Submit",
}: PatientsFormProps) {
  const [message, setMessage] = useState("");

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientsSchema),
    defaultValues: patientDefaultValues,
  });

  async function onSubmit(data: any) {
    setMessage("");
    // console.log("🚀 ~ data:", data);
    // console.log("🚀 ~ values:", form.getValues());
    try {
      const formData = objectToFormData(data);

      const result = await action(formData);
      if (result.success && result.data) {
        onSuccess(result.data);
        return;
      }

      setMessage(result.message);
    } catch (error) {
      console.log(error);
      setMessage(unexpectedError().message);
    } finally {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Form {...form}>
      <AlertMessage message={message} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 md:gap-6">
        <TextField
          name="name"
          label="Name"
          form={form}
          placeholder="John Doe"
          description="Full name as in your identification document"
        />
        <div className="flex gap-6">
          <TextField
            form={form}
            name="email"
            label="Email"
            placeholder="john@email.com"
            description="This will be used for logging in"
          />
          <TextField
            form={form}
            name="phone"
            label="Phone"
            placeholder="+351 000 000 000"
            description="Must include country code"
          />
        </div>
        <div className="flex gap-6">
          <DateField
            name="birthdate"
            label="Birthdate"
            placeholder="Pick your birthdate"
            form={form}
            className="flex-1"
          />
          <RadioField
            name="gender"
            label="Gender"
            form={form}
            options={genderTypes}
            className="flex-1"
          />
        </div>
        <TextField
          name="address"
          label="Address"
          form={form}
          placeholder="90210 Hollywood Boulevard"
          description="Full address"
        />
        <div className="flex gap-6">
          <TextField
            name="insuranceProvider"
            label="Insurance Provider"
            form={form}
            placeholder="BlueCross"
            description="Your insurance provider, if any (optional)"
          />
          <TextField
            name="insuranceNumber"
            label="Insurance Number"
            form={form}
            placeholder="0123456789"
            description="Your insurance number, if any (optional)"
          />
        </div>
        <div className="flex gap-6">
          <SelectField
            name="identificationType"
            label="Identification Type"
            form={form}
            placeholder="Select and identification type"
            options={idTypes}
            className="flex-1"
          />
          <TextField
            name="identificationNumber"
            label="Identification Number"
            form={form}
            placeholder="0123456789"
            description="Your id number (may contain letters)"
            className="flex-1"
          />
        </div>
        <FileField
          placeholder="Upload your identification document"
          name="identification"
          accept={allowedFileTypes}
          maxSize={maxFileSize}
          image={false}
          form={form}
        />
        <CheckboxField
          name="usageConsent"
          label="I accept the storage and use of my information for medical treatment purposes"
          description="All your data will be securely stored in our servers and shared with the doctors you chose to schedule an appointment with."
          form={form}
        />
        <CheckboxField
          name="privacyConsent"
          label="I have read and I accept the Terms & Conditions and the Privacy Policy"
          form={form}
        />
        <SubmitButton label={submitLabel} form={form} />
      </form>
    </Form>
  );
}