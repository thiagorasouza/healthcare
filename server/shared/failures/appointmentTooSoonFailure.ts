import { MIN_ADVANCE, MIN_ADVANCE_UNIT } from "@/server/config/constants";
import { Failure } from "@/server/core/failure";

export class AppointmentTooSoonFailure extends Failure<{
  startTime: Date;
  minAdvance: number;
  minAdvanceUnit: string;
}> {
  constructor(startTime: Date) {
    super({
      startTime,
      minAdvance: MIN_ADVANCE,
      minAdvanceUnit: MIN_ADVANCE_UNIT,
    });
  }
}
