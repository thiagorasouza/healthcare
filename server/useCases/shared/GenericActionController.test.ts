import { ValidationFailure } from "@/server/shared/failures";
import { objectToFormData } from "@/server/shared/helpers/utils";
import { UseCase } from "@/server/shared/protocols/useCase";
import { ValidatorInterface } from "@/server/shared/protocols/validator";
import { ValidationSuccess } from "@/server/shared/successes";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";
import { describe, expect, it, jest } from "@jest/globals";

interface MockType {
  field: string;
}

const mockObject = (): MockType => ({
  field: "value",
});

const mockFormData = () => {
  return objectToFormData(mockObject());
};

const mockValidator = () => {
  class ValidatorStub implements ValidatorInterface<MockType> {
    validate(): ValidationFailure | ValidationSuccess<MockType> {
      return new ValidationSuccess(mockObject());
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
  const sut = new GenericActionController(useCase, validator);

  return { sut, useCase, validator };
};

describe("GenericActionController Test Suite", () => {
  it("should fail if input is not valid", async () => {
    const { sut, validator } = makeSut();

    const formDataMock = mockFormData();

    const failure = new ValidationFailure(["field"]);
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