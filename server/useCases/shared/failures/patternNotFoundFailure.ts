import { Failure } from "@/server/useCases/shared/core/failure";

export class PatternNotFoundFailure extends Failure<{ id: string }> {
  constructor(id: string) {
    super("PatternNotFoundFailure", { id });
  }
}
