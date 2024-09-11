import { Failure } from "@/server/core/failure";

export class ValidationFailure extends Failure<string[]> {
  constructor(params: string[]) {
    super(params);
  }
}
