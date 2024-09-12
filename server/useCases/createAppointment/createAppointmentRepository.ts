import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { DoctorFoundSuccess } from "@/server/shared/successes/doctorFoundSuccess";

export interface CreateAppointmentRepository {
  getDoctorById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
}
