import { Failure } from "@/server/useCases/shared/core/failure";

export class DoctorNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super("DoctorNotFoundFailure", { id });
  }
}
