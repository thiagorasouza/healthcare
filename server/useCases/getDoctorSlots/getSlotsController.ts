import { GetSlotsRequest, GetSlotsUseCase } from "@/server/useCases/getDoctorSlots/getSlotsUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class GetSlotsController extends GenericController<GetSlotsRequest, GetSlotsUseCase> {}
