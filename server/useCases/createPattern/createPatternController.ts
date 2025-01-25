import {
  CreatePatternRequest,
  CreatePatternUseCase,
} from "@/server/useCases/createPattern/createPatternUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class CreatePatternController extends GenericController<
  CreatePatternRequest,
  CreatePatternUseCase
> {}
