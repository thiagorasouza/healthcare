"use server";

import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { StorageRepository } from "@/server/adapters/appwrite/storageRepository";
import { updatePatientValidator } from "@/server/adapters/zod/patientValidator";
import { UpdateAppointmentController } from "@/server/useCases/updateAppointment/updateAppointmentController";
import { UpdatePatientController } from "@/server/useCases/updatePatient/updateAppointmentController";
import { UpdatePatientUseCase } from "@/server/useCases/updatePatient/updatePatientUseCase";

export const updatePatient = async (formData: FormData) => {
  const patientsRepository = new PatientsRepository();
  const storageRepository = new StorageRepository();
  const useCase = new UpdatePatientUseCase(patientsRepository, storageRepository);
  const controller = new UpdatePatientController(useCase, updatePatientValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);

  return plainObject;
};
