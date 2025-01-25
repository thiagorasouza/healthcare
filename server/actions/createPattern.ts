"use server";

import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";
import { createPatternValidator } from "@/server/adapters/zod/patternValidator";
import { CreatePatternController } from "@/server/useCases/createPattern/createPatternController";
import { CreatePatternUseCase } from "@/server/useCases/createPattern/createPatternUseCase";

export const createPattern = async (formData: FormData) => {
  // console.log("🚀 ~ formData:", formData);
  const repository = new PatternsRepository();
  const useCase = new CreatePatternUseCase(repository);
  const controller = new CreatePatternController(useCase, createPatternValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);

  return plainObject;
};
