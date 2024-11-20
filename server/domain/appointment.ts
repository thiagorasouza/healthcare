import { MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { AppointmentData } from "@/server/domain/models/appointmentData";

import { AppointmentTooShortFailure } from "@/server/shared/failures/appointmentTooShortFailure";
import { AppointmentTooSoonFailure } from "@/server/shared/failures/appointmentTooSoonFailure";
import { AppointmentLogicSuccess } from "@/server/shared/successes";
import { addMinutes, isSameDay } from "date-fns";

export class Appointment {
  private data: AppointmentData;

  public constructor(data: AppointmentData) {
    this.data = data;
  }

  public get() {
    return this.data;
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

  public isConflicting(newAppointment: AppointmentData) {
    const { startTime, duration } = this.data;
    const newStartTime = newAppointment.startTime;

    if (!isSameDay(startTime, newStartTime)) {
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
