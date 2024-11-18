import {
  SendConfirmationRequest,
  SendConfirmationUseCase,
} from "@/server/useCases/sendConfirmation/sendConfirmationUseCase";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";

export class SendConfirmationController extends GenericActionController<
  SendConfirmationRequest,
  SendConfirmationUseCase
> {}
