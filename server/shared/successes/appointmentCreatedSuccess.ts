import { Success } from "@/server/core/success";
import { Appointment } from "@/server/domain/appointment";

export class AppointmentCreatedSuccess extends Success<Appointment> {
  constructor(appointment: Appointment) {
    super(appointment);
  }
}
