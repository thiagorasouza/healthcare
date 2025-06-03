import { Failure } from "@/server/useCases/shared/core/failure";

export class DoctorUnavailableFailure extends Failure<string> {
  constructor() {
    super("DoctorUnavailableFailure", "Doctor unavailable.");
  }
}
