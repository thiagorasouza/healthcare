"use server";

import { isTestingUser } from "@/server/adapters/appwrite/isTestingUser";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";

export const deletePatient = async (formData: FormData) => {
  let result;

  if (await isTestingUser()) {
    result = new ForbiddenInTestingFailure();
  } else {
    const repository = new PatientsRepository();
    result = await repository.delete(formData.get("id") as string);
  }

  const plainObject = Object.assign({}, result);
  return plainObject;
};
