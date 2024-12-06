import {
  SendConfirmationRequest,
  SendConfirmationUseCase,
} from "@/server/useCases/sendConfirmation/sendConfirmationUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class SendConfirmationController extends GenericController<
  SendConfirmationRequest,
  SendConfirmationUseCase
> {}
