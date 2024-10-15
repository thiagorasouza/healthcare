import { DoctorNotFoundFailure } from "@/server/shared/failures";
import { DoctorFoundSuccess } from "@/server/shared/successes";

export interface DoctorsRepositoryInterface {
  getDoctorById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
}
