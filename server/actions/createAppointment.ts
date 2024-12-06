"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";
import { appointmentValidator } from "@/server/adapters/zod/appointmentValidator";
import { CreateAppointmentController } from "@/server/useCases/createAppointment/createAppointmentController";
import { CreateAppointmentUseCase } from "@/server/useCases/createAppointment/createAppointmentUseCase";

export const createAppointment = async (formData: FormData) => {
  // console.log("🚀 ~ formData:", formData);

  const doctorsRepository = new DoctorsRepository();
  const patientsRepository = new PatientsRepository();
  const patternsRepository = new PatternsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new CreateAppointmentUseCase(
    doctorsRepository,
    patientsRepository,
    patternsRepository,
    appointmentsRepository,
  );
  const controller = new CreateAppointmentController(useCase, appointmentValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
