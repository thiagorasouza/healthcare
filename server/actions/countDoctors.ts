"use server";

import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { CountDoctorsController } from "@/server/useCases/countDoctors/countDoctorsController";
import { CountDoctorsUseCase } from "@/server/useCases/countDoctors/countDoctorsUseCase";

export const countDoctors = async () => {
  const doctorsRepository = new DoctorsRepository();
  const useCase = new CountDoctorsUseCase(doctorsRepository);
  const controller = new CountDoctorsController(useCase);

  const result = await controller.handle();
  const plainObject = { ...result };

  return plainObject;
};
