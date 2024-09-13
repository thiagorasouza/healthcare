import { Failure } from "@/server/core/failure";

export class AppointmentTooSoonFailure extends Failure<Date> {
  constructor(startTime: Date) {
    super(startTime);
  }
}
