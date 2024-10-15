import { Failure } from "@/server/core/failure";

export class AppointmentNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super({ id });
  }
}
