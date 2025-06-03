import { Failure } from "@/server/useCases/shared/core/failure";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export class PatientUnavailableFailure extends Failure<{
  patientId: string;
  startTime: Date;
  conflictingAppointment: AppointmentModel;
}> {
  constructor(patientId: string, startTime: Date, conflictingAppointment: AppointmentModel) {
    super("PatientUnavailableFailure", { patientId, startTime, conflictingAppointment });
  }
}
