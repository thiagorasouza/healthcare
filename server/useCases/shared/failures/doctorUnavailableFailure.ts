import { Failure } from "@/server/useCases/shared/core/failure";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export class DoctorUnavailableFailure extends Failure<{
  doctorId: string;
  startTime: Date;
}> {
  constructor(doctorId: string, startTime: Date) {
    super({ doctorId, startTime });
  }
}
