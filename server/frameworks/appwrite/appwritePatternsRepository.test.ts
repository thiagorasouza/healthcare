// HITS THE APPWRITE API

import { mockPattern } from "@/server/domain/mocks/pattern.mock";
import { PatternModel } from "@/server/domain/models/patternModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { AppwritePatternsRepository } from "@/server/frameworks/appwrite/appwritePatternsRepository";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

const makeSut = () => {
  const sut = new AppwritePatternsRepository();
  return { sut };
};

const patternMock = mockPattern();
Reflect.deleteProperty(patternMock, "id");

let patternCreated: Appwritify<PatternModel>;

describe("AppwritePatternsRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();
    patternCreated = (await sut.createDocument(patternMock)) as Appwritify<PatternModel>;
  });

  it("getPatternsByDoctorId should fail if patterns are not found", async () => {
    const { sut } = makeSut();

    const doctorId = "non_existent_id";
    const failure = new NotFoundFailure(doctorId);
    const result = await sut.getPatternsByDoctorId(doctorId);

    expect(result).toStrictEqual(failure);
  });

  it("getPatternsByDoctorId should return patterns if id is found", async () => {
    const { sut } = makeSut();

    const patternId = patternCreated.$id;
    const doctorId = patternCreated.doctorId;
    const success = new FoundSuccess<PatternModel[]>([{ ...patternMock, id: patternId }]);
    const result = await sut.getPatternsByDoctorId(doctorId);

    expect(result).toStrictEqual(success);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(patternCreated.$id);
  });
});
