"use server";

import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";
import { updatePatternValidator } from "@/server/adapters/zod/patternValidator";
import { UpdatePatternController } from "@/server/useCases/updatePattern/updatePatternController";
import { UpdatePatternUseCase } from "@/server/useCases/updatePattern/updatePatternUseCase";

export const updatePattern = async (formData: FormData) => {
  const repository = new PatternsRepository();
  const useCase = new UpdatePatternUseCase(repository);
  const controller = new UpdatePatternController(useCase, updatePatternValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);

  return plainObject;
};
