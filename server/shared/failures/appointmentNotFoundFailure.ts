import { Failure } from "@/server/core/failure";

export class AppointmentNotFoundFailure extends Failure<string> {
  constructor(queryId: string) {
    super(queryId);
  }
}
