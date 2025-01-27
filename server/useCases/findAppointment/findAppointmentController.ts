import {
  FindAppointmentRequest,
  FindAppointmentUseCase,
} from "@/server/useCases/findAppointment/findAppointmentUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class FindAppointmentController extends GenericController<
  FindAppointmentRequest,
  FindAppointmentUseCase
> {}
