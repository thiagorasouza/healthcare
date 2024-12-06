import { Failure } from "@/server/useCases/shared/core/failure";

export class ValidationFailure extends Failure<{ params: string[] }> {
  constructor(params: string[]) {
    super({ params });
  }
}
