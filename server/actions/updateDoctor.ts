"use server";

import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { isTestingUser } from "@/server/adapters/appwrite/isTestingUser";
import { StorageRepository } from "@/server/adapters/appwrite/storageRepository";
import { updateDoctorValidator } from "@/server/adapters/zod/doctorValidator";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";
import { UpdateDoctorController } from "@/server/useCases/updateDoctor/updateAppointmentController";
import { UpdateDoctorUseCase } from "@/server/useCases/updateDoctor/updateDoctorUseCase";

export const updateDoctor = async (formData: FormData) => {
  let result;

  if (await isTestingUser()) {
    result = new ForbiddenInTestingFailure();
  } else {
    const doctorsRepository = new DoctorsRepository();
    const storageRepository = new StorageRepository();
    const useCase = new UpdateDoctorUseCase(doctorsRepository, storageRepository);
    const controller = new UpdateDoctorController(useCase, updateDoctorValidator);
    result = await controller.handle(formData);
  }

  const plainObject = Object.assign({}, result);

  return plainObject;
};
