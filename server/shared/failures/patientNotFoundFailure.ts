import { Failure } from "@/server/core/failure";

export class PatientNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super({ id });
  }
}
