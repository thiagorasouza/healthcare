"use client";

import PatientsForm from "@/components/patients/PatientsForm";
import DefaultCard from "@/components/shared/DefaultCard";
import { createPatient, CreatePatientSuccess } from "@/lib/actions/createPatient";
import { toast } from "sonner";

export default function CreatePatientsPage() {
  function onSuccess(data: CreatePatientSuccess) {
    console.log("🚀 ~ result:", data);
    const name = data.patient.name;
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
