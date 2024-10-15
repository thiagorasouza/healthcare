// HITS THE APPWRITE API

import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { AppwriteAppointmentsRepository } from "@/server/frameworks/appwrite/appwriteAppointmentsRepository";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

const makeSut = () => {
  const sut = new AppwriteAppointmentsRepository();
  return { sut };
};

const appointmentMock = mockAppointment();
Reflect.deleteProperty(appointmentMock, "id");

let appointmentCreated: Appwritify<AppointmentModel>;

describe("AppwritePatternsRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();
    appointmentCreated = (await sut.createDocument(
      appointmentMock,
    )) as Appwritify<AppointmentModel>;
  });

  it("getAppointmentsByPatientId should fail if appointments are not found", async () => {
    const { sut } = makeSut();

    const patientId = "non_existent_id";
    const failure = new NotFoundFailure(patientId);
    const result = await sut.getAppointmentsByPatientId(patientId);

    expect(result).toStrictEqual(failure);
  });

  it("getAppointmentsByPatientId should return appointments if id is found", async () => {
    const { sut } = makeSut();

    const appointmentId = appointmentCreated.$id;
    const patientId = appointmentCreated.patientId;
    const success = new FoundSuccess<AppointmentModel[]>([
      { ...appointmentMock, id: appointmentId },
    ]);
    const result = await sut.getAppointmentsByPatientId(patientId);

    expect(result).toStrictEqual(success);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(appointmentCreated.$id);
  });
});
