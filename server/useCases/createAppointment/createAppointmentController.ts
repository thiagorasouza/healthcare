import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { ActionController } from "@/server/shared/protocols/actionController";
import { UseCase } from "@/server/shared/protocols/useCase";
import { ValidatorInterface } from "@/server/shared/protocols/validator";

export class CreateAppointmentController implements ActionController {
  constructor(
    private readonly useCase: UseCase,
    private readonly validator: ValidatorInterface<AppointmentModel>,
  ) {}

  async handle(formData: FormData) {
    const rawData = Object.fromEntries(formData);

    const validationResult = this.validator.validate(rawData);
    if (!validationResult.ok) {
      return validationResult;
    }

    const validData = validationResult.value;

    return this.useCase.execute(validData);
  }
}
