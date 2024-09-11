import { Success } from "@/server/core/success";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export class AppointmentCreatedSuccess extends Success<AppointmentModel> {
  constructor(appointment: AppointmentModel) {
    super(appointment);
  }
}
