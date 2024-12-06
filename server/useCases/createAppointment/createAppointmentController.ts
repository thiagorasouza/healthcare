import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { CreateAppointmentUseCase } from "@/server/useCases/createAppointment/createAppointmentUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class CreateAppointmentController extends GenericController<
  AppointmentModel,
  CreateAppointmentUseCase
> {}
