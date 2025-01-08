import { Failure } from "@/server/useCases/shared/core/failure";

export class ForbiddenInTestingFailure extends Failure<string> {
  constructor() {
    super("Action forbidden in testing.");
  }
}
