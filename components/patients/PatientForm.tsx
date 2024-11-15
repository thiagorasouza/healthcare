"use client";

import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import {
  allowedFileTypes,
  IdentificationData,
  maxFileSize,
  PatientZodData,
} from "@/lib/schemas/patientsSchema";
import { UseFormReturn } from "react-hook-form";
import { RadioField } from "@/components/forms/RadioField";
import SubmitButton from "@/components/forms/SubmitButton";
import { SelectField } from "@/components/forms/SelectField";
import { genderTypes, idTypes } from "@/lib/constants";
import FileField from "@/components/forms/FileField";
import { CheckboxField } from "@/components/forms/CheckboxField";
import AlertMessage from "@/components/forms/AlertMessage";
import { useEffect, useState } from "react";
import { objectToFormData } from "@/lib/utils";
import { unexpectedError } from "@/lib/results";
import { CreatePatientResult } from "@/lib/actions/createPatient";
import DateField from "@/components/forms/DateField";
import { UpdatePatientResult } from "@/lib/actions/updatePatient";
import { mockPatient } from "@/server/domain/mocks/patients.mock";
import { TestingOption } from "@/components/shared/TestingOption";
import { PatientData } from "@/server/domain/models/patientData";
import { PatientModel } from "@/server/domain/models/patientModel";

interface PatientFormProps {
  form: UseFormReturn<PatientData>;
  data?: PatientModel;
  identification?: IdentificationData;
  action: (form: FormData) => Promise<CreatePatientResult | UpdatePatientResult>;
  onSuccess: (data: PatientModel) => void;
  submitLabel?: string;
}

export default function PatientForm({
  form,
  data: patientData,
  identification,
  action,
  onSuccess,
  submitLabel = "Submit",
}: PatientFormProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!patientData?.identificationId || !identification) return;

    const currentFileName = identification?.name;
    const mockFile = new File([new Blob()], currentFileName, { type: "application/pdf" });

    form.setValue("identification", mockFile, {
      shouldValidate: true,
    });
  }, [patientData, form, identification]);

  function fillWithTestingData() {
    const patientMock = mockPatient();
    ["id", "authId", "identificationId"].map((key) => Reflect.deleteProperty(patientMock, key));
    patientMock["usageConsent"] = true;
    patientMock["privacyConsent"] = true;

    fetch("/pdf/test_pdf.pdf")
      .then((result) => result.blob())
      .then((blob) => {
        const identification = new File([blob], "test_pdf.pdf", { type: "application/pdf" });

        form.reset({ ...patientMock, identification });
      })
      .catch(console.log);
  }

  async function onSubmit(submittedData: PatientZodData) {
    setMessage("");
    try {
      const formData = objectToFormData(submittedData);
      if (patientData?.id && patientData?.authId) {
        formData.append("patientId", patientData.id);
        formData.append("authId", patientData.authId);
      }

      const result = await action(formData);
      console.log("🚀 ~ result:", result);
      if (result.success && result.data) {
        onSuccess(result.data);
        return;
      }

      setMessage(result.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.log(error);

      setMessage(unexpectedError().message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="p-6">
      <Form {...form}>
        <AlertMessage message={message} />
        <TestingOption
          feature="Fill form with testing data"
          onClick={fillWithTestingData}
          className="mb-4"
        />
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
    </div>
  );
}
