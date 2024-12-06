"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { recoverAppointmentValidator } from "@/server/adapters/zod/recoverAppointmentValidator";
import { RecoverAppointmentController } from "@/server/useCases/recoverAppointment/recoverAppointmentController";
import { RecoverAppointmentUseCase } from "@/server/useCases/recoverAppointment/recoverAppointmentUseCase";

export const recoverAppointment = async (formData: FormData) => {
  // console.log("🚀 ~ formData:", formData);

  const patientsRepository = new PatientsRepository();
  const doctorsRepository = new DoctorsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new RecoverAppointmentUseCase(
    patientsRepository,
    doctorsRepository,
    appointmentsRepository,
  );
  const controller = new RecoverAppointmentController(useCase, recoverAppointmentValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);

  return plainObject;
};
