import { Failure } from "@/server/core/failure";

export class AppointmentTooShortFailure extends Failure<number> {
  constructor(duration: number) {
    super(duration);
  }
}
