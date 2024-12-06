"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { ListAppointmentsUseCase } from "@/server/useCases/listAppointments/listAppointmentsUseCase";

export const listAppointments = async () => {
  const doctorsRepository = new DoctorsRepository();
  const patientsRepository = new PatientsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new ListAppointmentsUseCase(
    appointmentsRepository,
    doctorsRepository,
    patientsRepository,
  );

  const result = await useCase.execute();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
