import {
  RecoverAppointmentRequest,
  RecoverAppointmentUseCase,
} from "@/server/useCases/recoverAppointment/recoverAppointmentUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class RecoverAppointmentController extends GenericController<
  RecoverAppointmentRequest,
  RecoverAppointmentUseCase
> {}
