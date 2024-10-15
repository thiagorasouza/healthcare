import { ValidationFailure } from "@/server/shared/failures";
import { ActionController } from "@/server/shared/protocols/actionController";
import { UseCase } from "@/server/shared/protocols/useCase";
import { ValidatorInterface } from "@/server/shared/protocols/validator";

export class GenericActionController<T, K extends UseCase> implements ActionController {
  constructor(
    private readonly useCase: K,
    private readonly validator: ValidatorInterface<T>,
  ) {}

  async handle(formData: FormData): Promise<ValidationFailure | ReturnType<K["execute"]>> {
    const rawData = Object.fromEntries(formData);

    const validationResult = this.validator.validate(rawData);
    if (!validationResult.ok) {
      return validationResult;
    }

    const validData = validationResult.value;

    return this.useCase.execute(validData);
  }
}
