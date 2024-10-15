import { Failure } from "@/server/core/failure";

export class DoctorNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super({ id });
  }
}
