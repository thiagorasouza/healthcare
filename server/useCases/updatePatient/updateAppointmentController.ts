import { GenericController } from "@/server/useCases/shared/generics/GenericController";
import {
  UpdatePatientRequest,
  UpdatePatientUseCase,
} from "@/server/useCases/updatePatient/updatePatientUseCase";

export class UpdatePatientController extends GenericController<
  UpdatePatientRequest,
  UpdatePatientUseCase
> {}
