import {
  GetAppointmentRequest,
  GetAppointmentsUseCase,
} from "@/server/useCases/getAppointment/getAppointmentUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class GetAppointmentController extends GenericController<
  GetAppointmentRequest,
  GetAppointmentsUseCase
> {}
