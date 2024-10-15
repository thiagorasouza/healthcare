import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";
import { PatternsRepository } from "@/server/frameworks/appwrite/patternsRepository";
import { appointmentValidator } from "@/server/frameworks/zod/appointmentValidator";
import { CreateAppointmentController } from "@/server/useCases/createAppointment/createAppointmentController";
import { CreateAppointmentUseCase } from "@/server/useCases/createAppointment/createAppointmentUseCase";

export const createAppointment = (formData: FormData) => {
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

  return controller.handle(formData);
};
