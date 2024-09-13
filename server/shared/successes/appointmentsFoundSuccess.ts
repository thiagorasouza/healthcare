import { Success } from "@/server/core/success";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export class AppointmentsFoundSuccess extends Success<AppointmentModel[]> {
  constructor(appointments: AppointmentModel[]) {
    super(appointments);
  }
}
