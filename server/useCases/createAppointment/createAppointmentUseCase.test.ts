import { Success } from "@/server/core/success";
import { Appointment } from "@/server/domain/appointment";
import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { mockDoctor } from "@/server/domain/mocks/doctor.mock";
import { mockPatient } from "@/server/domain/mocks/patients.mock";
import { mockPattern } from "@/server/domain/mocks/pattern.mock";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Slots } from "@/server/domain/slots";
import { AppointmentsRepositoryInterface } from "@/server/repositories/appointmentsRepository";
import { DoctorsRepositoryInterface } from "@/server/repositories/doctorsRepository";
import { PatientsRepositoryInterface } from "@/server/repositories/patientsRepository";
import { PatternsRepositoryInterface } from "@/server/repositories/patternsRepository";
import {
  AppointmentNotFoundFailure,
  AppointmentTooShortFailure,
  DoctorNotFoundFailure,
  DoctorUnavailableFailure,
  NotFoundFailure,
  PatientNotFoundFailure,
  PatientUnavailableFailure,
  PatternNotFoundFailure,
  ServerFailure,
} from "@/server/shared/failures";
import {
  CreatedSuccess,
  AppointmentsFoundSuccess,
  DoctorFoundSuccess,
  PatientFoundSuccess,
  PatternsFoundSuccess,
  FoundSuccess,
} from "@/server/shared/successes";
import { CreateAppointmentUseCase } from "@/server/useCases/createAppointment/createAppointmentUseCase";
import { faker } from "@faker-js/faker";
import { beforeEach, expect, jest } from "@jest/globals";
import { addDays } from "date-fns";

const mockRequest = () => {
  const duration = 30;
  const tomorrow = addDays(new Date(), 1);
  const startTime = faker.date.soon({ refDate: tomorrow });
  const appointmentMock = mockAppointment(startTime, duration);
  Reflect.deleteProperty(appointmentMock, "id");
  return appointmentMock;
};

const mockDoctorsRepository = () => {
  class DoctorsRepositoryStub implements DoctorsRepositoryInterface {
    async getById(doctorId: string): Promise<DoctorFoundSuccess | DoctorNotFoundFailure> {
      const doctorMock = mockDoctor();
      doctorMock.id = doctorId;
      return new DoctorFoundSuccess(doctorMock);
    }

    async count(): Promise<Success<number> | ServerFailure> {
      return new Success(1);
    }
  }

  return new DoctorsRepositoryStub();
};

const mockPatientsRepository = () => {
  class PatientsRepositoryStub implements PatientsRepositoryInterface {
    async getById(patientId: string): Promise<PatientFoundSuccess | PatientNotFoundFailure> {
      const patientMock = mockPatient();
      patientMock.id = patientId;
      return new PatientFoundSuccess(patientMock);
    }
  }

  return new PatientsRepositoryStub();
};

const mockPatternsRepository = () => {
  class PatternsRepositoryStub implements PatternsRepositoryInterface {
    async getByDoctorId(doctorId: string): Promise<PatternsFoundSuccess | PatternNotFoundFailure> {
      const patternsMock = [mockPattern(), mockPattern()];
      for (const pattern of patternsMock) {
        pattern.doctorId = doctorId;
      }
      return new PatternsFoundSuccess(patternsMock);
    }
  }

  return new PatternsRepositoryStub();
};

const mockAppointmentsRepository = () => {
  class AppointmentsRepositoryStub implements AppointmentsRepositoryInterface {
    async getByPatientId(
      patientId: string,
    ): Promise<AppointmentsFoundSuccess | AppointmentNotFoundFailure> {
      const appointmentsMock = [mockAppointment(), mockAppointment()];
      for (const appointment of appointmentsMock) {
        appointment.patientId = patientId;
      }
      return new AppointmentsFoundSuccess(appointmentsMock);
    }

    async getByDoctorIdAndStartTime(
      doctorId: string,
      startTime: Date,
    ): Promise<FoundSuccess<AppointmentModel[]> | NotFoundFailure> {
      return new NotFoundFailure(doctorId);
    }

    async create(
      appointment: AppointmentModel,
    ): Promise<CreatedSuccess<AppointmentModel> | ServerFailure> {
      return new CreatedSuccess({ ...appointment, id: "new_id" });
    }
  }

  return new AppointmentsRepositoryStub();
};

const makeSut = () => {
  const doctorsRepository = mockDoctorsRepository();
  const patientsRepository = mockPatientsRepository();
  const patternsRepository = mockPatternsRepository();
  const appointmentsRepository = mockAppointmentsRepository();
  const sut = new CreateAppointmentUseCase(
    doctorsRepository,
    patientsRepository,
    patternsRepository,
    appointmentsRepository,
  );

  return { sut, doctorsRepository, patientsRepository, patternsRepository, appointmentsRepository };
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
    const { sut, doctorsRepository } = makeSut();

    const requestMock = mockRequest();
    const failure = new DoctorNotFoundFailure(requestMock.doctorId);

    jest.spyOn(doctorsRepository, "getById").mockReturnValueOnce(Promise.resolve(failure));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if patient does not exist", async () => {
    const { sut, patientsRepository } = makeSut();

    const requestMock = mockRequest();
    const failure = new PatientNotFoundFailure(requestMock.patientId);

    jest.spyOn(patientsRepository, "getById").mockReturnValueOnce(Promise.resolve(failure));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if doctor has no slots registered", async () => {
    const { sut, patternsRepository } = makeSut();

    const requestMock = mockRequest();
    const failure = new DoctorUnavailableFailure(requestMock.doctorId, requestMock.startTime);

    jest
      .spyOn(patternsRepository, "getByDoctorId")
      .mockReturnValueOnce(Promise.resolve(new PatternNotFoundFailure(requestMock.doctorId)));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if this doctor slot is not valid", async () => {
    const { sut } = makeSut();

    const requestMock = mockRequest();
    const failure = new DoctorUnavailableFailure(requestMock.doctorId, requestMock.startTime);

    jest.spyOn(Slots.prototype, "isValid").mockImplementationOnce(() => false);

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if doctor already has an appointment at the same time", async () => {
    const { sut, appointmentsRepository } = makeSut();

    const requestMock = mockRequest();

    const appointmentMock = mockAppointment();
    jest
      .spyOn(appointmentsRepository, "getByDoctorIdAndStartTime")
      .mockReturnValueOnce(Promise.resolve(new FoundSuccess([appointmentMock])));

    const failure = new DoctorUnavailableFailure(requestMock.doctorId, requestMock.startTime);

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if patient is not available", async () => {
    const { sut, appointmentsRepository } = makeSut();

    const requestMock = mockRequest();

    const appointmentMock = mockAppointment();
    jest
      .spyOn(appointmentsRepository, "getByPatientId")
      .mockReturnValueOnce(Promise.resolve(new AppointmentsFoundSuccess([appointmentMock])));

    const failure = new PatientUnavailableFailure(
      requestMock.patientId,
      requestMock.startTime,
      appointmentMock,
    );

    jest.spyOn(Appointment.prototype, "isConflicting").mockImplementationOnce(() => true);

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should fail if saving appointment fails", async () => {
    const { sut, appointmentsRepository } = makeSut();

    const requestMock = mockRequest();
    const failure = new ServerFailure("");

    jest.spyOn(appointmentsRepository, "create").mockReturnValueOnce(Promise.resolve(failure));

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(failure);
  });

  it("should succeed if everything is ok", async () => {
    const { sut } = makeSut();

    const requestMock = mockRequest();

    const result = await sut.execute(requestMock);
    expect(result).toStrictEqual(new CreatedSuccess({ ...requestMock, id: "new_id" }));
  });
});
