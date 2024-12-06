import { MIN_ADVANCE, ADVANCE_UNIT } from "@/server/config/constants";
import { Failure } from "@/server/useCases/shared/core/failure";

export class AppointmentTooSoonFailure extends Failure<{
  startTime: Date;
  minAdvance: number;
  minAdvanceUnit: string;
}> {
  constructor(startTime: Date) {
    super({
      startTime,
      minAdvance: MIN_ADVANCE,
      minAdvanceUnit: ADVANCE_UNIT,
    });
  }
}
