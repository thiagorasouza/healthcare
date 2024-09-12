import { LogicFailure } from "@/server/shared/failures/logicFailure";
import { CreateAppointment } from "@/server/useCases/createAppointment/createAppointment";
import { faker } from "@faker-js/faker";
import { expect, jest } from "@jest/globals";

const mockRequest = () => ({
  doctorId: faker.string.alphanumeric(12),
  patientId: faker.string.alphanumeric(12),
  startTime: faker.date.soon(),
});

const makeSut = () => {
  const sut = new CreateAppointment();

  return { sut };
};

describe("CreateAppointment Use Case Test Suite", () => {
  it("should fail if appointment is in the past", async () => {
    const { sut } = makeSut();

    const requestMock = mockRequest();
    requestMock.startTime = faker.date.recent();

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(new LogicFailure(["startTime"]));
  });
});
