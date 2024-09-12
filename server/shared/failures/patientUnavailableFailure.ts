import { Failure } from "@/server/core/failure";

export class PatientUnavailableFailure extends Failure<{
  patientId: string;
  startTime: Date;
}> {
  constructor(patientId: string, startTime: Date) {
    super({ patientId, startTime });
  }
}
