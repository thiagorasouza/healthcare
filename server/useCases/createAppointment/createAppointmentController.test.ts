import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { ValidationFailure } from "@/server/shared/failures";
import { objectToFormData } from "@/server/shared/helpers/formData";
import { UseCase } from "@/server/shared/protocols/useCase";
import { ValidatorInterface } from "@/server/shared/protocols/validator";
import { ValidationSuccess } from "@/server/shared/successes";
import { CreateAppointmentController } from "@/server/useCases/createAppointment/createAppointmentController";
import { describe, expect, it, jest } from "@jest/globals";

const appointmentMock = mockAppointment();
// Reflect.deleteProperty(appointmentMock, "id");

const mockFormData = () => {
  return objectToFormData(appointmentMock);
};

const mockValidator = () => {
  class ValidatorStub implements ValidatorInterface<AppointmentModel> {
    validate(rawData: any): ValidationFailure | ValidationSuccess<AppointmentModel> {
      return new ValidationSuccess(appointmentMock);
    }
  }

  return new ValidatorStub();
};

const mockUseCase = () => {
  class UseCaseStub implements UseCase {
    async execute() {
      return;
    }
  }

  return new UseCaseStub();
};

const makeSut = () => {
  const useCase = mockUseCase();
  const validator = mockValidator();
  const sut = new CreateAppointmentController(useCase, validator);

  return { sut, useCase, validator };
};

describe("CreateAppointmentController Test Suite", () => {
  it("should fail if input is not valid", async () => {
    const { sut, validator } = makeSut();

    const formDataMock = mockFormData();

    const failure = new ValidationFailure(["patientId"]);
    jest.spyOn(validator, "validate").mockReturnValueOnce(failure);

    const result = await sut.handle(formDataMock);
    expect(result).toStrictEqual(failure);
  });

  it("should call use case if input is valid", async () => {
    const { sut, useCase } = makeSut();

    const useCaseSpy = jest.spyOn(useCase, "execute");

    const formDataMock = mockFormData();
    await sut.handle(formDataMock);

    expect(useCaseSpy).toHaveBeenCalled();
  });
});
