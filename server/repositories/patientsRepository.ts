import { PatientNotFoundFailure } from "@/server/shared/failures";
import { PatientFoundSuccess } from "@/server/shared/successes";

export interface PatientsRepository {
  getPatientById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure>;
}
