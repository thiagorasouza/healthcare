import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { LogicFailure } from "@/server/shared/failures/logicFailure";
import { AppointmentLogicSuccess } from "@/server/shared/successes/appointmentLogicSuccess";

type EntityCreationResult = AppointmentLogicSuccess | LogicFailure;

export class Appointment {
  private constructor(public readonly model: AppointmentModel) {}

  // New appointments
  public static create(data: AppointmentModel): EntityCreationResult {
    const now = new Date();
    if (data.startTime < now) {
      return new LogicFailure(["startTime"]);
    }

    const appointment = new Appointment(data);
    return new AppointmentLogicSuccess(appointment);
  }
}
