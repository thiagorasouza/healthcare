"use server";

import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { isTestingUser } from "@/server/adapters/appwrite/isTestingUser";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";

export const deleteDoctor = async (formData: FormData) => {
  let result;

  if (await isTestingUser()) {
    result = new ForbiddenInTestingFailure();
  } else {
    const repository = new DoctorsRepository();
    result = await repository.delete(formData.get("id") as string);
  }

  const plainObject = Object.assign({}, result);
  return plainObject;
};
