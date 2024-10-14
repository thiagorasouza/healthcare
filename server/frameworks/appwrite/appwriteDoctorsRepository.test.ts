// HITS THE APPWRITE API

import { mockDoctor } from "@/server/domain/mocks/doctor.mock";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { AppwriteDoctorsRepository } from "@/server/frameworks/appwrite/appwriteDoctorsRepository";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";
import { afterAll, beforeAll, expect } from "@jest/globals";

const makeSut = () => {
  const sut = new AppwriteDoctorsRepository();
  return { sut };
};

const doctorMock = mockDoctor();
Reflect.deleteProperty(doctorMock, "id");

let doctorCreated: Appwritify<DoctorModel>;

describe("AppwriteDoctorsRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();
    doctorCreated = (await sut.createDocument(doctorMock)) as Appwritify<DoctorModel>;
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

    const doctorId = doctorCreated.$id;
    const success = new FoundSuccess<DoctorModel>({ ...doctorMock, id: doctorId });
    const result = await sut.getDoctorById(doctorId);

    expect(result).toStrictEqual(success);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(doctorCreated.$id);
  });
});
