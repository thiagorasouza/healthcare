"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { getAppointmentValidator } from "@/server/adapters/zod/getAppointmentValidator";
import { GetAppointmentController } from "@/server/useCases/getAppointment/getAppointmentController";
import { GetAppointmentsUseCase } from "@/server/useCases/getAppointment/getAppointmentUseCase";

export const getAppointment = async (formData: FormData) => {
  const doctorsRepository = new DoctorsRepository();
  const patientsRepository = new PatientsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new GetAppointmentsUseCase(
    appointmentsRepository,
    doctorsRepository,
    patientsRepository,
  );

  const controller = new GetAppointmentController(useCase, getAppointmentValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
