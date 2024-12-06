import { Success } from "@/server/useCases/shared/core/success";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export class AppointmentsFoundSuccess extends Success<AppointmentModel[]> {
  constructor(appointments: AppointmentModel[]) {
    super(appointments);
  }
}
