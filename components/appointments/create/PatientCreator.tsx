import AlertMessage from "@/components/forms/AlertMessage";
import PatientsForm from "@/components/patients/PatientsForm";
import DefaultCard from "@/components/shared/DefaultCard";
import { Button } from "@/components/ui/button";
import { createPatient } from "@/lib/actions/createPatient";
import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
import { updatePatient } from "@/lib/actions/updatePatient";
import { env } from "@/lib/env";
import { unexpectedError } from "@/lib/results";
import { IdentificationData, PatientParsedData } from "@/lib/schemas/patientsSchema";
import { objectToFormData } from "@/lib/utils";
import { createAppointment } from "@/server/actions/createAppointment";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { set } from "date-fns";
import { ArrowRight, SquarePen } from "lucide-react";
import { useState } from "react";

interface PatientCreatorProps {
  doctor: DoctorModel;
  date?: string;
  hour?: { hour: string; duration: number };
  onChangeClick: () => void;
  onBooked: (patient: PatientParsedData) => void;
  onPatientCreated: (patient: PatientParsedData) => void;
}

export function PatientCreator({
  doctor,
  date,
  hour,
  onChangeClick,
  onBooked,
  onPatientCreated,
}: PatientCreatorProps) {
  const [showPatientForm, setShowPatientForm] = useState(true);
  const [patientData, setPatientData] = useState<PatientParsedData | undefined>();
  const [identification, setIdentification] = useState<IdentificationData | undefined>();
  const [message, setMessage] = useState("");

  async function onPatientCreatedOld(patient: PatientParsedData) {
    onPatientCreated(patient);
    setShowPatientForm(false);
    setPatientData(patient);

    const identificationResult = await getFileMetadataServer(
      env.docsBucketId,
      patient.identificationId,
    );

    setIdentification(identificationResult?.data);
  }

  function onPatientEditClick() {
    setShowPatientForm(true);
  }

  async function onBookClick() {
    if (!doctor) return;

    setMessage("");
    try {
      const doctorId = doctor.id;
      const patientId = patientData!.$id;

      const [hours, minutes] = hour!.hour.split(":").map((x) => Number(x));
      const startTime = set(new Date(date!), { hours, minutes, seconds: 0, milliseconds: 0 });

      const duration = hour!.duration;

      const result = await createAppointment(
        objectToFormData({ doctorId, patientId, startTime, duration }),
      );
      if (!result.ok) {
        setMessage(result.error.code);
        return;
      }

      onBooked(patientData!);
    } catch (error) {
      console.log(error);

      setMessage(unexpectedError().message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="flex-1">
      <AlertMessage message={message} />
      <DefaultCard
        title=""
        description={
          !patientData ? "Please fill in your details to proceed" : "Current saved patient"
        }
      >
        {showPatientForm && (
          <PatientsForm
            data={patientData}
            identification={identification}
            action={patientData ? updatePatient : createPatient}
            onSuccess={onPatientCreatedOld}
            submitLabel="Save"
          />
        )}
        {!showPatientForm && (
          <div className="mt-7 flex">
            <div>
              <Button className="flex items-center" variant="outline" onClick={onPatientEditClick}>
                <SquarePen className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="ml-auto">
              <Button className="flex items-center" onClick={onBookClick}>
                Confirm & Book
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DefaultCard>
    </div>
    // </div>
  );
}
