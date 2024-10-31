// HITS THE APPWRITE API

import { Success } from "@/server/core/success";
import { mockPattern } from "@/server/domain/mocks/pattern.mock";
import { PatternModel } from "@/server/domain/models/patternModel";
import { PatternsRepository } from "@/server/frameworks/appwrite/patternsRepository";
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

    const result = await sut.create(patternMock);
    if (!result.ok) {
      throw result;
    }

    patternCreated = result.value;
  });

  it("getByDoctorId should return an empty array if patterns are not found", async () => {
    const { sut } = makeSut();

    const doctorId = "non_existent_id";
    const result = await sut.getByDoctorId(doctorId);

    expect(result).toStrictEqual(new Success([]));
  });

  it("getByDoctorId should return patterns if id is found", async () => {
    const { sut } = makeSut();

    const patternId = patternCreated.id!;
    const doctorId = patternCreated.doctorId;
    const success = new Success<PatternModel[]>([{ ...patternMock, id: patternId }]);
    const result = await sut.getByDoctorId(doctorId);

    expect(result).toStrictEqual(success);
  });

  afterAll(async () => {
    const { sut } = makeSut();
    await sut.deleteDocument(patternCreated.id!);
  });
});
