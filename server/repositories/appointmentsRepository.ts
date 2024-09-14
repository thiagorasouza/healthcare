import { Appointment } from "@/server/domain/appointment";
import { AppointmentNotFoundFailure } from "@/server/shared/failures";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { AppointmentCreatedSuccess, AppointmentsFoundSuccess } from "@/server/shared/successes";

export interface AppointmentsRepository {
  getAppointmentsByPatientId(
    patientId: string,
  ): Promise<AppointmentsFoundSuccess | AppointmentNotFoundFailure>;
  createAppointment(appointment: Appointment): Promise<AppointmentCreatedSuccess | ServerFailure>;
}
