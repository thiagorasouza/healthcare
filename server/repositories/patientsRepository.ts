import { Success } from "@/server/core/success";
import { PatientModel } from "@/server/domain/models/patientModel";
import { RepositoryInterface } from "@/server/repositories/repository";
import { ServerFailure } from "@/server/shared/failures";

export interface PatientsRepositoryInterface extends RepositoryInterface<PatientModel> {
  getByEmail(email: string): Promise<Success<PatientModel> | ServerFailure>;
}
