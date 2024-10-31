import { Success } from "@/server/core/success";
import { DoctorNotFoundFailure, ServerFailure } from "@/server/shared/failures";
import { DoctorFoundSuccess } from "@/server/shared/successes";

export interface DoctorsRepositoryInterface {
  getById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
  count(): Promise<Success<number> | ServerFailure>;
}
