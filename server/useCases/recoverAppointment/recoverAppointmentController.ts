import {
  RecoverAppointmentRequest,
  RecoverAppointmentUseCase,
} from "@/server/useCases/recoverAppointment/recoverAppointmentUseCase";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";

export class RecoverAppointmentController extends GenericActionController<
  RecoverAppointmentRequest,
  RecoverAppointmentUseCase
> {}
