import { MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { AppointmentTooShortFailure } from "@/server/shared/failures/appointmentTooShortFailure";
import { AppointmentTooSoonFailure } from "@/server/shared/failures/appointmentTooSoonFailure";
import { AppointmentLogicSuccess } from "@/server/shared/successes";
import { addMinutes } from "date-fns";

export class Appointment {
  private data: AppointmentModel;

  public constructor(data: AppointmentModel) {
    this.data = data;
  }

  public validate() {
    const { startTime, duration } = this.data;

    const minAdvance = addMinutes(new Date(), MIN_ADVANCE);

    if (startTime < minAdvance) {
      return new AppointmentTooSoonFailure(startTime);
    }

    if (duration < MIN_DURATION) {
      return new AppointmentTooShortFailure(duration);
    }

    return new AppointmentLogicSuccess(this);
  }

  public isConflicting(newAppointment: AppointmentModel) {
    const { startTime, duration } = this.data;
    const endTime = addMinutes(startTime, duration);

    const newStartTime = newAppointment.startTime;
    const newEndTime = addMinutes(newStartTime, duration);

    if (
      (newStartTime >= startTime && newStartTime < endTime) ||
      (newEndTime > startTime && newEndTime <= endTime)
    ) {
      return true;
    }

    return false;
  }
}
