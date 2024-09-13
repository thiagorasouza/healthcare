import { AppointmentNotFoundFailure } from "@/server/shared/failures/appointmentNotFoundFailure";
import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { PatientNotFoundFailure } from "@/server/shared/failures/patientNotFoundFailure";
import { PatternNotFoundFailure } from "@/server/shared/failures/patternNotFoundFailure";
import { AppointmentsFoundSuccess } from "@/server/shared/successes";
import { DoctorFoundSuccess } from "@/server/shared/successes/doctorFoundSuccess";
import { PatientFoundSuccess } from "@/server/shared/successes/patientFoundSuccess";
import { PatternsFoundSuccess } from "@/server/shared/successes/patternsFoundSuccess";

export interface CreateAppointmentRepository {
  getDoctorById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure>;
  getPatientById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure>;
  getPatternsByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure>;
  getAppointmentsByPatientId(
    patientId: string,
  ): Promise<AppointmentsFoundSuccess | AppointmentNotFoundFailure>;
}
