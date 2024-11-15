import { ValidationFailure } from "@/server/shared/failures";
import { ActionController } from "@/server/shared/protocols/actionController";
import { UseCase } from "@/server/shared/protocols/useCase";
import { ValidatorInterface } from "@/server/shared/protocols/validator";

export class GenericActionController<RequestType, UseCaseType extends UseCase>
  implements ActionController
{
  constructor(
    private readonly useCase: UseCaseType,
    private readonly validator: ValidatorInterface<RequestType>,
  ) {}

  async handle(
    formData: FormData,
  ): Promise<ValidationFailure | ReturnType<UseCaseType["execute"]>> {
    const rawData = Object.fromEntries(formData);

    const validationResult = this.validator.validate(rawData);
    if (!validationResult.ok) {
      return validationResult;
    }

    const validData = validationResult.value;

    return this.useCase.execute(validData);
  }
}
