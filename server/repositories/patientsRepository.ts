import { PatientNotFoundFailure } from "@/server/shared/failures";
import { PatientFoundSuccess } from "@/server/shared/successes";

export interface PatientsRepositoryInterface {
  getById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure>;
}
