import { genders, identificationTypes } from "@/server/config/constants";
import { Gender, IdentificationType } from "@/server/domain/models/patientModel";
import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { LogicFailure } from "@/server/shared/failures/logicFailure";
import { PatientNotFoundFailure } from "@/server/shared/failures/patientNotFoundFailure";
import { DoctorFoundSuccess } from "@/server/shared/successes/doctorFoundSuccess";
import { PatientFoundSuccess } from "@/server/shared/successes/patientFoundSuccess";
import { CreateAppointment } from "@/server/useCases/createAppointment/createAppointment";
import { CreateAppointmentRepository } from "@/server/useCases/createAppointment/createAppointmentRepository";
import { faker } from "@faker-js/faker";
import { expect, jest } from "@jest/globals";

const mockRequest = () => ({
  doctorId: faker.string.alphanumeric(12),
  patientId: faker.string.alphanumeric(12),
  startTime: faker.date.soon(),
});

const mockDoctor = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  specialty: faker.person.jobType(),
  bio: faker.lorem.paragraph(),
  pictureId: faker.string.uuid(),
  authId: faker.string.uuid(),
});

const mockPatient = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  birthdate: faker.date.birthdate(),
  gender: faker.helpers.arrayElement(genders) as Gender,
  address: faker.location.streetAddress(),
  insuranceProvider: faker.company.name(),
  insuranceNumber: faker.string.alphanumeric(8),
  identificationType: faker.helpers.arrayElement(identificationTypes) as IdentificationType,
  identificationNumber: faker.string.alphanumeric(8),
  identificationId: faker.string.uuid(),
  usageConsent: faker.datatype.boolean(),
  privacyConsent: faker.datatype.boolean(),
  authId: faker.string.uuid(),
});

const makeRepository = () => {
  class CreateAppointmentRepositoryStub implements CreateAppointmentRepository {
    async getDoctorById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure> {
      const doctorMock = mockDoctor();
      doctorMock.id = doctorId;
      return new DoctorFoundSuccess(doctorMock);
    }

    async getPatientById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure> {
      const patientMock = mockPatient();
      patientMock.id = patientId;
      return new PatientFoundSuccess(patientMock);
    }
  }

  return new CreateAppointmentRepositoryStub();
};

const makeSut = () => {
  const repository = makeRepository();
  const sut = new CreateAppointment(repository);

  return { sut, repository };
};

describe("CreateAppointment Use Case Test Suite", () => {
  it("should fail if appointment is in the past", async () => {
    const { sut } = makeSut();

    const requestMock = mockRequest();
    requestMock.startTime = faker.date.recent();

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(new LogicFailure(["startTime"]));
  });

  it("should fail if doctor does not exist", async () => {
    const { sut, repository } = makeSut();

    const requestMock = mockRequest();
    const failure = new DoctorNotFoundFailure(requestMock.doctorId);

    jest.spyOn(repository, "getDoctorById").mockReturnValueOnce(Promise.resolve(failure));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if patient does not exist", async () => {
    const { sut, repository } = makeSut();

    const requestMock = mockRequest();
    const failure = new PatientNotFoundFailure(requestMock.patientId);

    jest.spyOn(repository, "getPatientById").mockReturnValueOnce(Promise.resolve(failure));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });
});
