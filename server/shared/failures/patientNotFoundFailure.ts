import { Failure } from "@/server/core/failure";

export class PatientNotFoundFailure extends Failure<string> {
  constructor(patientId: string) {
    super(patientId);
  }
}
