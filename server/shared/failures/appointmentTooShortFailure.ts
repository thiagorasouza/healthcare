import { MIN_DURATION, MIN_DURATION_UNIT } from "@/server/config/constants";
import { Failure } from "@/server/core/failure";

export class AppointmentTooShortFailure extends Failure<{
  duration: number;
  minDuration: number;
  minDurationUnit: string;
}> {
  constructor(duration: number) {
    super({
      duration,
      minDuration: MIN_DURATION,
      minDurationUnit: MIN_DURATION_UNIT,
    });
  }
}
