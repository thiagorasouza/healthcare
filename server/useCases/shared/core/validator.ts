import { ValidationFailure } from "@/server/useCases/shared/failures";
import { ValidationSuccess } from "@/server/useCases/shared/successes";

export interface ValidatorInterface<T> {
  validate(rawData: any): ValidationSuccess<T> | ValidationFailure;
}
