import { ValidationFailure } from "@/server/useCases/shared/failures";
import { Controller } from "@/server/useCases/shared/core/controller";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { ValidatorInterface } from "@/server/useCases/shared/core/validator";

export class GenericController<RequestType, UseCaseType extends UseCase> implements Controller {
  constructor(
    private readonly useCase: UseCaseType,
    private readonly validator?: ValidatorInterface<RequestType>,
  ) {}

  async handle(
    formData?: FormData,
  ): Promise<ValidationFailure | ReturnType<UseCaseType["execute"]>> {
    if (!formData) {
      return this.useCase.execute();
    }

    let rawData = Object.fromEntries(formData);
    if (!this.validator) {
      return this.useCase.execute(rawData);
    }

    const validationResult = this.validator.validate(rawData);
    if (!validationResult.ok) {
      return validationResult;
    }
    const validData = validationResult.value;

    return this.useCase.execute(validData);
  }
}
