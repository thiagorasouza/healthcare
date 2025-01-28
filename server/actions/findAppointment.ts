"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { findAppointmentValidator } from "@/server/adapters/zod/findAppointmentValidator";
import { FindAppointmentController } from "@/server/useCases/findAppointment/findAppointmentController";
import { FindAppointmentUseCase } from "@/server/useCases/findAppointment/findAppointmentUseCase";

export const findAppointment = async (formData: FormData) => {
  const patientsRepository = new PatientsRepository();
  const doctorsRepository = new DoctorsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new FindAppointmentUseCase(
    patientsRepository,
    doctorsRepository,
    appointmentsRepository,
  );
  const controller = new FindAppointmentController(useCase, findAppointmentValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);

  return plainObject;
};
