import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientModel } from "@/server/domain/models/patientModel";

export interface AppointmentHydrated {
  id: string;
  doctor: DoctorModel;
  patient: PatientModel;
  startTime: Date;
  duration: number;
}
