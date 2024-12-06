"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { EmailsRepository } from "@/server/adapters/resend/emailsRepository";
import { sendConfirmationValidator } from "@/server/adapters/zod/sendConfirmationValidator";
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
