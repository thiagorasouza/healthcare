import { Failure } from "@/server/useCases/shared/core/failure";

export class ForbiddenInTestingFailure extends Failure<string> {
  constructor() {
    super("ForbiddenInTestingFailure", "Action forbidden in testing.");
  }
}
