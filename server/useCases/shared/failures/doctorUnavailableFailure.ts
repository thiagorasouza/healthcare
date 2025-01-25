import { Failure } from "@/server/useCases/shared/core/failure";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export class DoctorUnavailableFailure extends Failure<string> {
  constructor() {
    super("Doctor unavailable.");
  }
}
