import { Appointment } from "@/server/domain/appointment";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { CreatedSuccess } from "@/server/shared/successes/createdSuccess";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";

type T = AppointmentModel;

export interface AppointmentsRepository {
  getAppointmentsByPatientId(patientId: string): Promise<FoundSuccess<T[]> | NotFoundFailure>;
  createAppointment(appointment: Appointment): Promise<CreatedSuccess<T> | ServerFailure>;
}
