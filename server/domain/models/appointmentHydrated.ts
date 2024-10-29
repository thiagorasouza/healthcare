import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";

export interface AppointmentHydrated {
  id: string;
  doctor: Pick<DoctorModel, "name" | "specialty" | "pictureId">;
  patient: Pick<PatientModel, "name" | "email" | "phone" | "insuranceProvider">;
  startTime: Date;
  duration: number;
}
