// HITS THE APPWRITE API

import { mockPattern } from "@/server/domain/mocks/pattern.mock";
import { PatternModel } from "@/server/domain/models/patternModel";
import { PatternsRepository } from "@/server/frameworks/appwrite/patternsRepository";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

const makeSut = () => {
  const sut = new PatternsRepository();
  return { sut };
};

const patternMock = mockPattern();
Reflect.deleteProperty(patternMock, "id");

let patternCreated: PatternModel;

describe("PatternsRepository Test Suite", () => {
  beforeAll(async () => {
    const { sut } = makeSut();

    const result = await sut.createDocument(patternMock);
    if (!result.ok) {
      throw result;
    }

    patternCreated = result.value;
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

    const patternId = patternCreated.id!;
    const doctorId = patternCreated.doctorId;
    const success = new FoundSuccess<PatternModel[]>([{ ...patternMock, id: patternId }]);
    const result = await sut.getPatternsByDoctorId(doctorId);

    expect(result).toStrictEqual(success);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(patternCreated.id!);
  });
});
