import { DoctorNotFoundFailure } from "@/server/shared/failures";
import { DoctorFoundSuccess } from "@/server/shared/successes";

export interface DoctorsRepository {
  getDoctorById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
}
