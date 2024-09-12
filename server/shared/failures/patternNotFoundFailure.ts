import { Failure } from "@/server/core/failure";

export class PatternNotFoundFailure extends Failure<string> {
  constructor(queryId: string) {
    super(queryId);
  }
}
