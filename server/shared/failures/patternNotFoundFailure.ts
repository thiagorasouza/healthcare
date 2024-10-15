import { Failure } from "@/server/core/failure";

export class PatternNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super({ id });
  }
}
