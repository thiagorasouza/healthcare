"use client";

import PatientsForm from "@/components/patients/PatientForm";
import DefaultCard from "@/components/shared/DefaultCard";
import { updatePatient } from "@/lib/actions/updatePatient";
import { IdentificationData, PatientParsedData } from "@/lib/schemas/patientsSchema";
import { toast } from "sonner";

interface PatientUpdateCardProps {
  data: PatientParsedData;
  identification: IdentificationData;
}

export default function PatientUpdateCard({ data, identification }: PatientUpdateCardProps) {
  function onSuccess(data: PatientParsedData) {
    console.log("🚀 ~ result:", data);
    toast(`Patient ${data.name} updated successfully.`);
  }

  return (
    <DefaultCard title="Edit Patient" description="Make changes to this patient details">
      <PatientsForm
        data={data}
        action={updatePatient}
        onSuccess={onSuccess}
        identification={identification}
      />
    </DefaultCard>
  );
}
