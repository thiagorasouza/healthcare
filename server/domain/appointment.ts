import { MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { AppointmentTooShortFailure } from "@/server/shared/failures/appointmentTooShortFailure";
import { AppointmentTooSoonFailure } from "@/server/shared/failures/appointmentTooSoonFailure";
import { addMinutes, startOfDay } from "@/server/shared/helpers/dateHelpers";
import { AppointmentLogicSuccess } from "@/server/shared/successes";

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
    const newStartTime = newAppointment.startTime;

    if (startOfDay(startTime) !== startOfDay(newStartTime)) {
      return false;
    }

    const newEndTime = addMinutes(newStartTime, duration);
    const endTime = addMinutes(startTime, duration);

    if (
      (newStartTime >= startTime && newStartTime < endTime) ||
      (newEndTime > startTime && newEndTime <= endTime)
    ) {
      return true;
    }

    return false;
  }
}
