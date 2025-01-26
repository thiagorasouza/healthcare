import { GetSlotsRequest, GetSlotsUseCase } from "@/server/useCases/getSlots/getSlotsUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class GetSlotsController extends GenericController<GetSlotsRequest, GetSlotsUseCase> {}
