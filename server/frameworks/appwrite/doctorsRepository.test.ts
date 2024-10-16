// HITS THE APPWRITE API

import { mockDoctor } from "@/server/domain/mocks/doctor.mock";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";
import { afterAll, beforeAll, expect } from "@jest/globals";

const makeSut = () => {
  const sut = new DoctorsRepository();
  return { sut };
};

const doctorMock = mockDoctor();
Reflect.deleteProperty(doctorMock, "id");

let doctorCreated: DoctorModel;

describe("DoctorsRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();

    const result = await sut.createDocument(doctorMock);
    if (!result.ok) {
      throw result;
    }

    doctorCreated = result.value;
  });

  it("getDoctorById should fail if id is not found", async () => {
    const { sut } = makeSut();

    const doctorId = "non_existent_id";
    const failure = new NotFoundFailure(doctorId);
    const result = await sut.getDoctorById(doctorId);

    expect(result).toStrictEqual(failure);
  });

  it("getDoctorById should return doctor if id is found", async () => {
    const { sut } = makeSut();

    const doctorId = doctorCreated.id!;
    const success = new FoundSuccess<DoctorModel>({ ...doctorMock, id: doctorId });
    const result = await sut.getDoctorById(doctorId);

    expect(result).toStrictEqual(success);
  });

  it("count should return the document count", async () => {
    const { sut } = makeSut();

    const result = await sut.count();

    expect(result.ok).toBe(true);
    // @ts-ignore
    expect(result?.value).toBeGreaterThanOrEqual(1);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(doctorCreated.id!);
  });
});
