import { GenericController } from "@/server/useCases/shared/generics/GenericController";
import {
  UpdatePatternRequest,
  UpdatePatternUseCase,
} from "@/server/useCases/updatePattern/updatePatternUseCase";

export class UpdatePatternController extends GenericController<
  UpdatePatternRequest,
  UpdatePatternUseCase
> {}
