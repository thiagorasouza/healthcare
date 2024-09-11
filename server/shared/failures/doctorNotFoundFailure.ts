import { Failure } from "@/server/core/failure";

export class DoctorNotFoundFailure extends Failure<string> {
  constructor(doctorId: string) {
    super(doctorId);
  }
}
