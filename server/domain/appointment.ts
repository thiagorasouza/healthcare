import { MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { addMinutes } from "date-fns";

export class Appointment {
  private data: AppointmentModel;

  public constructor(data: AppointmentModel) {
    this.data = data;
  }

  public isValid() {
    const { startTime, endTime } = this.data;
    const duration = (endTime.getTime() - startTime.getTime()) / (60 * 1000);
    const minAdvance = addMinutes(new Date(), MIN_ADVANCE);
    return startTime >= minAdvance && duration >= MIN_DURATION;
  }

  // public constructor() {
  //   const now = new Date();
  //   if (data.startTime < now) {
  //     return new LogicFailure(["startTime"]);
  //   }

  //   const appointment = new Appointment(data);
  //   return new AppointmentLogicSuccess(appointment);
  // }
}
