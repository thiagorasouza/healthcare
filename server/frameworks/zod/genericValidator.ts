import { ValidationFailure } from "@/server/shared/failures";
import { ValidatorInterface } from "@/server/shared/protocols/validator";
import { ValidationSuccess } from "@/server/shared/successes";
import { SafeParseError, ZodSchema } from "zod";

export class GenericValidator<T> implements ValidatorInterface<T> {
  constructor(private readonly zodSchema: ZodSchema) {}

  public validate(rawData: any): ValidationFailure | ValidationSuccess<T> {
    const validation = this.zodSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldsList = this.getInvalidFieldsList(validation);
      return new ValidationFailure(fieldsList);
    }

    return new ValidationSuccess(validation.data);
  }

  private getInvalidFieldsList<U>(validationError: SafeParseError<U>): string[] {
    const fieldErrors = validationError.error?.flatten().fieldErrors;
    return fieldErrors ? Object.keys(fieldErrors) : [];
  }
}
