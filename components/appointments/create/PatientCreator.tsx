import PatientsForm from "@/components/patients/PatientsForm";
import DefaultCard from "@/components/shared/DefaultCard";
import { createPatient } from "@/lib/actions/createPatient";
import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
import { updatePatient } from "@/lib/actions/updatePatient";
import { env } from "@/lib/env";
import { IdentificationData, PatientParsedData } from "@/lib/schemas/patientsSchema";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { useState } from "react";

interface PatientCreatorProps {
  doctor: DoctorModel;
  date?: string;
  hour?: { hour: string; duration: number };
  onBooked: (patient: PatientParsedData) => void;
  onPatientCreated: (patient: PatientParsedData) => void;
}

export function PatientCreator({ onPatientCreated }: PatientCreatorProps) {
  const [patientData, setPatientData] = useState<PatientParsedData | undefined>();
  const [identification, setIdentification] = useState<IdentificationData | undefined>();

  async function onPatientCreatedOld(patient: PatientParsedData) {
    onPatientCreated(patient);
    setPatientData(patient);

    const identificationResult = await getFileMetadataServer(
      env.docsBucketId,
      patient.identificationId,
    );

    setIdentification(identificationResult?.data);
  }

  return (
    <div className="flex-1">
      <DefaultCard
        title=""
        description={
          !patientData ? "Please fill in your details to proceed" : "Current saved patient"
        }
      >
        <PatientsForm
          data={patientData}
          identification={identification}
          action={patientData ? updatePatient : createPatient}
          onSuccess={onPatientCreatedOld}
          submitLabel="Save"
        />
      </DefaultCard>
    </div>
  );
}
