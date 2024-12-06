import { Failure } from "@/server/useCases/shared/core/failure";

export class PatientNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super({ id });
  }
}
