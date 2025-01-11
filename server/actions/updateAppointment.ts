"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";
import { updateAppointmentValidator } from "@/server/adapters/zod/appointmentValidator";
import { UpdateAppointmentController } from "@/server/useCases/updateAppointment/updateAppointmentController";
import { UpdateAppointmentUseCase } from "@/server/useCases/updateAppointment/updateAppointmentUseCase";

export const updateAppointment = async (formData: FormData) => {
  const doctorsRepository = new DoctorsRepository();
  const patientsRepository = new PatientsRepository();
  const patternsRepository = new PatternsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new UpdateAppointmentUseCase(
    doctorsRepository,
    patientsRepository,
    patternsRepository,
    appointmentsRepository,
  );
  const controller = new UpdateAppointmentController(useCase, updateAppointmentValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);

  return plainObject;
};
