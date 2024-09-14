import { weekdays } from "@/lib/schemas/patternsSchema";
import { genders, identificationTypes } from "@/server/config/constants";
import { Appointment } from "@/server/domain/appointment";
import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { Gender, IdentificationType } from "@/server/domain/models/patientModel";
import { Slots } from "@/server/domain/slots";
import {
  AppointmentNotFoundFailure,
  DoctorNotFoundFailure,
  DoctorUnavailableFailure,
  PatientNotFoundFailure,
  PatientUnavailableFailure,
  PatternNotFoundFailure,
} from "@/server/shared/failures";
import { AppointmentTooShortFailure } from "@/server/shared/failures/appointmentTooShortFailure";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import {
  AppointmentCreatedSuccess,
  AppointmentsFoundSuccess,
  DoctorFoundSuccess,
  PatientFoundSuccess,
  PatternsFoundSuccess,
} from "@/server/shared/successes";
import { CreateAppointment } from "@/server/useCases/createAppointment/createAppointment";
import { CreateAppointmentRepository } from "@/server/useCases/createAppointment/createAppointmentRepository";
import { faker } from "@faker-js/faker";
import { beforeEach, expect, jest } from "@jest/globals";
import { addDays, addHours, addWeeks } from "date-fns";

const mockRequest = () => {
  const startTime = faker.date.soon({ refDate: addDays(new Date(), 1) });
  return {
    doctorId: faker.string.alphanumeric(12),
    patientId: faker.string.alphanumeric(12),
    startTime,
    duration: 30,
  };
};

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

const mockPattern = () => {
  const startDate = faker.date.soon();

  return {
    id: faker.string.uuid(),
    startDate,
    endDate: addWeeks(startDate, 1),
    startTime: startDate,
    endTime: addHours(startDate, 3),
    duration: 30,
    recurring: faker.datatype.boolean(),
    weekdays: faker.helpers.arrayElements(weekdays, 2),
    doctorId: faker.string.uuid(),
  };
};

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

    async getPatternsByDoctorId(
      doctorId: string,
    ): Promise<PatternsFoundSuccess | PatternNotFoundFailure> {
      const patternsMock = [mockPattern(), mockPattern()];
      for (const pattern of patternsMock) {
        pattern.doctorId = doctorId;
      }
      return new PatternsFoundSuccess(patternsMock);
    }

    async getAppointmentsByPatientId(
      patientId: string,
    ): Promise<AppointmentsFoundSuccess | AppointmentNotFoundFailure> {
      const appointmentsMock = [mockAppointment(), mockAppointment()];
      for (const appointment of appointmentsMock) {
        appointment.patientId = patientId;
      }
      return new AppointmentsFoundSuccess(appointmentsMock);
    }

    async createAppointment(
      appointment: Appointment,
    ): Promise<AppointmentCreatedSuccess | ServerFailure> {
      const appointmentMock = new Appointment(mockRequest());
      return new AppointmentCreatedSuccess(appointmentMock);
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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Slots.prototype, "isValid").mockImplementation(() => true);
    jest.spyOn(Appointment.prototype, "isConflicting").mockImplementation(() => false);
  });

  it("should fail if appointment logic is invalid", async () => {
    const { sut } = makeSut();

    const requestMock = mockRequest();
    const failure = new AppointmentTooShortFailure(requestMock.duration);

    jest.spyOn(Appointment.prototype, "validate").mockImplementationOnce(() => failure);

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
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

  it("should fail if doctor has no slots registered", async () => {
    const { sut, repository } = makeSut();

    const requestMock = mockRequest();
    const failure = new DoctorUnavailableFailure(requestMock.doctorId, requestMock.startTime);

    jest
      .spyOn(repository, "getPatternsByDoctorId")
      .mockReturnValueOnce(Promise.resolve(new PatternNotFoundFailure(requestMock.doctorId)));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if doctor is not available", async () => {
    const { sut, repository } = makeSut();

    const requestMock = mockRequest();
    const failure = new DoctorUnavailableFailure(requestMock.doctorId, requestMock.startTime);

    jest.spyOn(Slots.prototype, "isValid").mockImplementationOnce(() => false);

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if patient is not available", async () => {
    const { sut, repository } = makeSut();

    const requestMock = mockRequest();
    const failure = new PatientUnavailableFailure(requestMock.patientId, requestMock.startTime);

    jest.spyOn(Appointment.prototype, "isConflicting").mockImplementationOnce(() => true);

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if saving appointment fails", async () => {
    const { sut, repository } = makeSut();

    const requestMock = mockRequest();
    const failure = new ServerFailure("");

    jest.spyOn(repository, "createAppointment").mockReturnValueOnce(Promise.resolve(failure));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });
});
