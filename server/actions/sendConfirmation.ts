"use server";

import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";
import { EmailsRepository } from "@/server/frameworks/resend/emailsRepository";
import { sendConfirmationValidator } from "@/server/frameworks/zod/sendConfirmationValidator";
import { SendConfirmationController } from "@/server/useCases/sendConfirmation/sendConfirmationController";
import { SendConfirmationUseCase } from "@/server/useCases/sendConfirmation/sendConfirmationUseCase";

export const sendConfirmation = async (formData: FormData) => {
  const emailsRepository = new EmailsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const doctorsRepository = new DoctorsRepository();
  const patientsRepository = new PatientsRepository();
  const useCase = new SendConfirmationUseCase(
    emailsRepository,
    appointmentsRepository,
    doctorsRepository,
    patientsRepository,
  );
  const controller = new SendConfirmationController(useCase, sendConfirmationValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
