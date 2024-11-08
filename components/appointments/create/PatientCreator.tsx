import AlertMessage from "@/components/forms/AlertMessage";
import PatientsForm from "@/components/patients/PatientsForm";
import BackButton from "@/components/shared/BackButton";
import DefaultCard from "@/components/shared/DefaultCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createPatient } from "@/lib/actions/createPatient";
import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
import { getImageLink } from "@/lib/actions/getImageLink";
import { updatePatient } from "@/lib/actions/updatePatient";
import { env } from "@/lib/env";
import { unexpectedError } from "@/lib/results";
import { IdentificationData, PatientParsedData } from "@/lib/schemas/patientsSchema";
import { getInitials, objectToFormData } from "@/lib/utils";
import { createAppointment } from "@/server/actions/createAppointment";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { format, set } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CircleUserRound,
  Clock,
  Hourglass,
  SquarePen,
} from "lucide-react";
import { useState } from "react";

interface PatientCreatorProps {
  doctor: DoctorModel;
  date?: string;
  hour?: { hour: string; duration: number };
  onChangeClick: () => void;
  onBooked: (patient: PatientParsedData) => void;
}

export function PatientCreator({
  doctor,
  date,
  hour,
  onChangeClick,
  onBooked,
}: PatientCreatorProps) {
  const [showPatientForm, setShowPatientForm] = useState(true);
  const [patientData, setPatientData] = useState<PatientParsedData | undefined>();
  const [identification, setIdentification] = useState<IdentificationData | undefined>();
  const [message, setMessage] = useState("");

  async function onPatientCreated(patient: PatientParsedData) {
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
    <div>
      <AlertMessage message={message} />
      <div className="grid grid-cols-12 items-start gap-6">
        <DefaultCard
          title="Appointment"
          description="Your appointment so far"
          className="col-span-4 self-start"
        >
          <div className="mb-8 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={getImageLink(doctor!.pictureId)} />
              <AvatarFallback>{getInitials(doctor!.name)}</AvatarFallback>
            </Avatar>
            <div className="font-semibold">
              <p className="text-lg">{`Dr. ${doctor!.name}`}</p>
              <p className="text-sm text-gray">{doctor!.specialty}</p>
            </div>
            <div>
              <p></p>
            </div>
          </div>
          <div className="mb-8 space-y-2 text-sm">
            <p className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(date!), "PPP")}
            </p>
            <p className="flex items-center gap-3">
              <Clock className="h-4 w-4" />
              {hour?.hour}
            </p>
            <p className="flex items-center gap-3">
              <Hourglass className="h-4 w-4" />
              {hour?.duration} minutes
            </p>
          </div>
          <BackButton label="Change" onBackClick={onChangeClick} />
        </DefaultCard>
        <DefaultCard
          title="Patient details"
          description={
            !patientData ? "Please fill in your details to proceed" : "Current saved patient"
          }
          className="col-span-8"
        >
          {showPatientForm ? (
            <PatientsForm
              data={patientData}
              identification={identification}
              action={patientData ? updatePatient : createPatient}
              onSuccess={onPatientCreated}
              submitLabel="Save"
            />
          ) : patientData ? (
            <div className="flex items-center gap-3">
              <div>
                <CircleUserRound className="h-9 w-9" />
              </div>
              <div>
                <p className="font-semibold">{patientData.name}</p>
                <p className="text-sm">
                  {patientData.email} | {patientData.phone}
                </p>
              </div>
            </div>
          ) : (
            <p>Error retrieving saved patient. Please edit below</p>
          )}
          {!showPatientForm && (
            <div className="mt-7 flex">
              <div>
                <Button
                  className="flex items-center"
                  variant="outline"
                  onClick={onPatientEditClick}
                >
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
    </div>
  );
}
