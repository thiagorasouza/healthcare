// HITS THE APPWRITE API

import { Success } from "@/server/useCases/shared/core/success";
import { mockDoctor } from "@/server/domain/mocks/doctor.mock";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { NotFoundFailure } from "@/server/useCases/shared/failures/notFoundFailure";
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

    const result = await sut.create(doctorMock);
    if (!result.ok) {
      throw result;
    }

    doctorCreated = result.value;
  });

  it("getById should fail if id is not found", async () => {
    const { sut } = makeSut();

    const doctorId = "non_existent_id";
    const failure = new NotFoundFailure(doctorId);
    const result = await sut.getById(doctorId);

    expect(result).toStrictEqual(failure);
  });

  it("getById should return doctor if id is found", async () => {
    const { sut } = makeSut();

    const doctorId = doctorCreated.id!;
    const success = new Success<DoctorModel>({ ...doctorMock, id: doctorId });
    const result = await sut.getById(doctorId);

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
    await sut.delete(doctorCreated.id! + "a");
  });
});
