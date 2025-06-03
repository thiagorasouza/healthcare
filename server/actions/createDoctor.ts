"use server";

import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { isTestingUser } from "@/server/adapters/appwrite/isTestingUser";
import { StorageRepository } from "@/server/adapters/appwrite/storageRepository";
import { doctorValidator } from "@/server/adapters/zod/doctorValidator";
import { CreateDoctorController } from "@/server/useCases/createDoctor/createDoctorController";
import { CreateDoctorUseCase } from "@/server/useCases/createDoctor/createDoctorUseCase";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";

export const createDoctor = async (formData: FormData, skipCheck = false) => {
  let result;

  if (!skipCheck && (await isTestingUser())) {
    result = new ForbiddenInTestingFailure();
  } else {
    const patientsRepository = new DoctorsRepository();
    const storageRepository = new StorageRepository();
    const useCase = new CreateDoctorUseCase(patientsRepository, storageRepository);
    const controller = new CreateDoctorController(useCase, doctorValidator);

    result = await controller.handle(formData);
  }

  const plainObject = Object.assign({}, result);
  return plainObject;
};
