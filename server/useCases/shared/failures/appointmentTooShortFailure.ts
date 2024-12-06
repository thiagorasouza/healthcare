import { MIN_DURATION, DURATION_UNIT } from "@/server/config/constants";
import { Failure } from "@/server/useCases/shared/core/failure";

export class AppointmentTooShortFailure extends Failure<{
  duration: number;
  minDuration: number;
  minDurationUnit: string;
}> {
  constructor(duration: number) {
    super({
      duration,
      minDuration: MIN_DURATION,
      minDurationUnit: DURATION_UNIT,
    });
  }
}
