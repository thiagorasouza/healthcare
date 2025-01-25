"use server";

import { isTestingUser } from "@/server/adapters/appwrite/isTestingUser";
import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";

export const deletePattern = async (formData: FormData) => {
  let result;

  if (await isTestingUser()) {
    result = new ForbiddenInTestingFailure();
  } else {
    const repository = new PatternsRepository();
    result = await repository.delete(formData.get("id") as string);
  }

  const plainObject = Object.assign({}, result);
  return plainObject;
};
