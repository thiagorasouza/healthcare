"use client";

import PatientsForm from "@/components/patients/PatientForm";
import DefaultCard from "@/components/shared/DefaultCard";
import { createPatient, CreatePatientResult } from "@/lib/actions/createPatient";
import { PatientParsedData } from "@/lib/schemas/patientsSchema";
import { toast } from "sonner";

export default function CreatePatientsPage() {
  function onSuccess(data: PatientParsedData) {
    const name = data.name;
    toast(`Patient ${name} successfully created.`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <DefaultCard title="New Patient" description="Create a new patient">
        <PatientsForm action={createPatient} onSuccess={onSuccess} />
      </DefaultCard>
    </div>
  );
}
