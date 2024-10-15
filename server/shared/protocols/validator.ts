import { ValidationFailure } from "@/server/shared/failures";
import { ValidationSuccess } from "@/server/shared/successes";

export interface ValidatorInterface<T> {
  validate(rawData: any): ValidationSuccess<T> | ValidationFailure;
}
