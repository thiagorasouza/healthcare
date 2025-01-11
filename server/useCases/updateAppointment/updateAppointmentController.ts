import { GenericController } from "@/server/useCases/shared/generics/GenericController";
import {
  UpdateAppointmentRequest,
  UpdateAppointmentUseCase,
} from "@/server/useCases/updateAppointment/updateAppointmentUseCase";

export class UpdateAppointmentController extends GenericController<
  UpdateAppointmentRequest,
  UpdateAppointmentUseCase
> {}
