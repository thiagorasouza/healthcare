import { Success } from "@/server/core/success";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { DoctorNotFoundFailure, ServerFailure } from "@/server/shared/failures";
import { DoctorFoundSuccess } from "@/server/shared/successes";

export interface DoctorsRepositoryInterface {
  getById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
  listByIds(values: string[]): Promise<ServerFailure | Success<DoctorModel[]>>;
  count(): Promise<Success<number> | ServerFailure>;
}
