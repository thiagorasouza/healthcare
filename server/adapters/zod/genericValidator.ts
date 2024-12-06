import { ValidationFailure } from "@/server/useCases/shared/failures";
import { ValidatorInterface } from "@/server/useCases/shared/core/validator";
import { ValidationSuccess } from "@/server/useCases/shared/successes";
import { SafeParseError, ZodSchema } from "zod";

export class GenericValidator<RequestType> implements ValidatorInterface<RequestType> {
  constructor(private readonly zodSchema: ZodSchema) {}

  public validate(rawData: any): ValidationFailure | ValidationSuccess<RequestType> {
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
