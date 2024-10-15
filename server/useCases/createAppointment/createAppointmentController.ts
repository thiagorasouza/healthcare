import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { CreateAppointmentUseCase } from "@/server/useCases/createAppointment/createAppointmentUseCase";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";

export class CreateAppointmentController extends GenericActionController<
  AppointmentModel,
  CreateAppointmentUseCase
> {}
