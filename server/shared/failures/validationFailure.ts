import { Failure } from "@/server/core/failure";

export class ValidationFailure extends Failure<{ params: string[] }> {
  constructor(params: string[]) {
    super({ params });
  }
}
