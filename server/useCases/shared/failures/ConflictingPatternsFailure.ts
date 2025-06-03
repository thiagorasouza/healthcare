import { Failure } from "@/server/useCases/shared/core/failure";

export class ConflictingPatternsFailure extends Failure<string> {
  constructor() {
    super("ConflictingPatternsFailure", "Conflicting patterns");
  }
}
