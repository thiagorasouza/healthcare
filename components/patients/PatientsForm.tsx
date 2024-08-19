"use client";

import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import {
  allowedFileTypes,
  maxFileSize,
  PatientData,
  patientDefaultValues,
  patientsSchema,
} from "@/lib/schemas/patientsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BirthdatePicker from "@/components/forms/BirthdatePicker";
import { RadioField } from "@/components/forms/RadioField";
import SubmitButton from "@/components/forms/SubmitButton";
import { SelectField } from "@/components/forms/SelectField";
import { genderTypes, idTypes } from "@/lib/constants";
import FileField from "@/components/forms/FileField";
import { CheckboxField } from "@/components/forms/CheckboxField";

export default function PatientsForm() {
  const form = useForm<PatientData>({
    resolver: zodResolver(patientsSchema),
    defaultValues: patientDefaultValues,
  });

  function onSubmit(data: any) {
    console.log("🚀 ~ data:", data);
    console.log("🚀 ~ values:", form.getValues());
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onSubmit)}
        className="flex flex-col gap-3 md:gap-6"
      >
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
          <BirthdatePicker
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
        <SubmitButton label="Submit" form={form} />
      </form>
    </Form>
  );
}
