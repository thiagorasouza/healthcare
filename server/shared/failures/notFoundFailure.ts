import { Failure } from "@/server/core/failure";

export class NotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super({ id });
  }
}
