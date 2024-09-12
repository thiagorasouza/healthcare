import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { PatientNotFoundFailure } from "@/server/shared/failures/patientNotFoundFailure";
import { DoctorFoundSuccess } from "@/server/shared/successes/doctorFoundSuccess";
import { PatientFoundSuccess } from "@/server/shared/successes/patientFoundSuccess";

export interface CreateAppointmentRepository {
  getDoctorById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
  getPatientById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure>;
}
