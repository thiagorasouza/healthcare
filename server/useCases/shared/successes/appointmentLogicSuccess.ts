import { Success } from "@/server/useCases/shared/core/success";
import { Appointment } from "@/server/domain/appointment";

export class AppointmentLogicSuccess extends Success<Appointment> {
  constructor(appointment: Appointment) {
    super(appointment);
  }
}
