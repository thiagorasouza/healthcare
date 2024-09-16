// INTEGRATION TESTS

import { env } from "@/server/config/env";
import { mockDoctor } from "@/server/domain/mocks/doctor.mock";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { AppwriteDoctorRepository } from "@/server/frameworks/appwrite/appwriteDoctorRepository";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { databases } from "@/server/frameworks/appwrite/appwriteNodeClient";
import { DoctorNotFoundFailure } from "@/server/shared/failures";
import { afterAll, beforeAll, expect } from "@jest/globals";

const makeSut = () => {
  const sut = new AppwriteDoctorRepository(databases, env.databaseId, env.doctorsCollectionId);
  return { sut };
};

const doctorMock = mockDoctor();
Reflect.deleteProperty(doctorMock, "id");

let doctorCreated: Appwritify<DoctorModel>;

describe("AppwriteDoctorRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();
    doctorCreated = (await sut.createDocument(doctorMock)) as Appwritify<DoctorModel>;
  });

  it("getDoctorById should fail if id is not found", async () => {
    const { sut } = makeSut();

    const doctorId = "non_existent_id";
    const failure = new DoctorNotFoundFailure(doctorId);
    const result = await sut.getDoctorById(doctorId);

    expect(result).toStrictEqual(failure);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(doctorCreated.$id);
  });
});
