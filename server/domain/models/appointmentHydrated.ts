import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";

export interface AppointmentHydrated {
  id: string;
  doctor: Pick<DoctorModel, "id" | "name" | "specialty" | "pictureId">;
  patient: Pick<PatientModel, "id" | "name" | "email" | "phone" | "insuranceProvider">;
  startTime: Date;
  duration: number;
}
