import { Failure } from "@/server/useCases/shared/core/failure";

export class NotFoundFailure extends Failure<{ what: string }> {
  constructor(what: string) {
    super("NotFoundFailure", { what });
  }
}
