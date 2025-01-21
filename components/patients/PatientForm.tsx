"use client";

import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RadioField } from "@/components/forms/RadioField";
import SubmitButton from "@/components/forms/SubmitButton";
import { SelectField } from "@/components/forms/SelectField";
import { genderTypes, idTypes } from "@/lib/constants";
import FileField from "@/components/forms/FileField";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { useEffect, useState } from "react";
import { objectToFormData } from "@/lib/utils";
import DateField from "@/components/forms/DateField";
import { mockPatientData } from "@/server/domain/mocks/patient.mock";
import { TestingOption } from "@/components/testing/TestingOption";
import { PatientData } from "@/server/domain/models/patientData";
import { PatientModel } from "@/server/domain/models/patientModel";
import { getFile } from "@/server/actions/getFile.bypass";
import { displayError } from "@/server/config/errors";
import { mockSizeZeroPDF } from "@/server/domain/mocks/file.mock";
import { createPatient } from "@/server/actions/createPatient";
import { ErrorDialog } from "@/components/shared/ErrorDialog";
import { allowedFileTypes, maxFileSize } from "@/server/config/constants";
import { SavingOverlay } from "@/components/shared/SavingOverlay";
import { updatePatient } from "@/server/actions/updatePatient";

export interface CreatePatientProps {
  mode: "create";
  form: UseFormReturn<PatientData>;
  patient?: undefined;
  onPatientSaved: (data: PatientModel) => void;
}

export interface UpdatePatientProps {
  mode: "update";
  form: UseFormReturn<PatientData>;
  patient: Required<PatientModel>;
  onPatientSaved: (data: PatientModel) => void;
}

export default function PatientForm({
  form,
  mode,
  patient,
  onPatientSaved,
}: CreatePatientProps | UpdatePatientProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Creates a mock PDF from patient.identificationId when editting a patient
  useEffect(() => {
    if (mode !== "update") return;

    const getIdentification = async () => {
      const identificationResult = await getFile(
        objectToFormData({ id: patient.identificationId }),
      );

      if (!identificationResult.ok) {
        setMessage(displayError(identificationResult));
        return;
      }

      const { name: fileName } = identificationResult.value;

      form.setValue("identification", mockSizeZeroPDF(fileName), {
        shouldValidate: true,
      });
    };

    getIdentification();
  }, [form, mode, patient?.identificationId]);

  async function fillWithTestingData() {
    const patientDataMock = await mockPatientData();
    form.reset({ ...patientDataMock });
  }

  async function onSubmit(data: PatientData) {
    try {
      setMessage("");
      setLoading(true);
      const formData = objectToFormData(data);
      if (mode === "create") {
        const createResult = await createPatient(formData);
        if (!createResult.ok) {
          setMessage(displayError(createResult));
          return;
        }

        onPatientSaved(createResult.value);
      } else if (mode === "update") {
        formData.append("id", patient.id);
        const updateResult = await updatePatient(formData);
        if (!updateResult.ok) {
          setMessage(displayError(updateResult));
          return;
        }

        onPatientSaved(updateResult.value);
      }
    } catch (error) {
      console.log(error);
      setMessage(displayError());
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <>
      {loading && <SavingOverlay />}
      <Form {...form}>
        <ErrorDialog message={message} setMessage={setMessage} />
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
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
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
          <div className="mb-1 flex flex-col gap-3 md:flex-row md:gap-6">
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
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
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
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
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
            className="my-2"
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
            className="mb-2"
          />
          <SubmitButton label="Save" form={form} />
        </form>
      </Form>
    </>
  );
}
