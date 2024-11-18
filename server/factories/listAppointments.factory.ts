import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";
import { ListAppointmentsUseCase } from "@/server/useCases/listAppointments/listAppointmentsUseCase";

export const listAppointmentsFactory = () => {
  const doctorsRepository = new DoctorsRepository();
  const patientsRepository = new PatientsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new ListAppointmentsUseCase(
    appointmentsRepository,
    doctorsRepository,
    patientsRepository,
  );

  return useCase;
};
