// HITS THE APPWRITE API

import { Success } from "@/server/core/success";
import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

const makeSut = () => {
  const sut = new AppointmentsRepository();
  return { sut };
};

const appointmentMock = mockAppointment();
Reflect.deleteProperty(appointmentMock, "id");

let appointmentCreated: AppointmentModel;

describe("AppointmentsRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();

    const result = await sut.create(appointmentMock);
    if (!result.ok) {
      throw result;
    }

    appointmentCreated = result.value;
  });

  it("getByPatientId should return an empty array if appointments are not found", async () => {
    const { sut } = makeSut();

    const patientId = "non_existent_id";
    const result = await sut.getByPatientId(patientId);

    expect(result).toStrictEqual(new Success([]));
  });

  it("getByPatientId should return appointments if id is found", async () => {
    const { sut } = makeSut();

    const appointmentId = appointmentCreated.id!;
    const patientId = appointmentCreated.patientId;
    const success = new Success<AppointmentModel[]>([{ ...appointmentMock, id: appointmentId }]);
    const result = await sut.getByPatientId(patientId);

    expect(result).toStrictEqual(success);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.delete(appointmentCreated.id!);
  });
});
