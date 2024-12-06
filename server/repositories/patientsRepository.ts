import { Success } from "@/server/useCases/shared/core/success";
import { PatientModel } from "@/server/domain/models/patientModel";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { RepositoryInterface } from "@/server/repositories/repository";

export interface PatientsRepositoryInterface extends RepositoryInterface<PatientModel> {
  getByEmail(email: string): Promise<Success<PatientModel> | ServerFailure>;
}
