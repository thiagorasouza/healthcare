"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { isTestingUser } from "@/server/adapters/appwrite/isTestingUser";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";

export const deleteAppointment = async (formData: FormData) => {
  let result;

  if (await isTestingUser()) {
    result = new ForbiddenInTestingFailure();
  } else {
    const repository = new AppointmentsRepository();
    result = await repository.delete(formData.get("id") as string);
  }

  const plainObject = Object.assign({}, result);
  return plainObject;
};
