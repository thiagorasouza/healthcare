import { Success } from "@/server/core/success";
import { PatientModel } from "@/server/domain/models/patientModel";
import { NotFoundFailure, PatientNotFoundFailure, ServerFailure } from "@/server/shared/failures";
import { PatientFoundSuccess } from "@/server/shared/successes";

export interface PatientsRepositoryInterface {
  getById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure>;
  getByEmail(email: string): Promise<Success<PatientModel> | ServerFailure>;
}
