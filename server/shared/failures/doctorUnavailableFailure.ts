import { Failure } from "@/server/core/failure";

export class DoctorUnavailableFailure extends Failure<{
  doctorId: string;
  startTime: Date;
}> {
  constructor(doctorId: string, startTime: Date) {
    super({ doctorId, startTime });
  }
}
