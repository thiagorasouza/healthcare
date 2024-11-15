"use server";

import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";
import { StorageRepository } from "@/server/frameworks/appwrite/storageRepository";
import { patientValidator } from "@/server/frameworks/zod/patientValidator";
import { CreatePatientController } from "@/server/useCases/createPatient/createPatientController";
import { CreatePatientUseCase } from "@/server/useCases/createPatient/createPatientUseCase";

export type CreatePatientResult = ReturnType<typeof createPatient>;

export const createPatient = async (formData: FormData) => {
  // console.log("🚀 ~ formData:", formData);

  const patientsRepository = new PatientsRepository();
  const storageRepository = new StorageRepository();
  const useCase = new CreatePatientUseCase(patientsRepository, storageRepository);
  const controller = new CreatePatientController(useCase, patientValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
