import { GetSlotsRequest, GetSlotsUseCase } from "@/server/useCases/getDoctorSlots/getSlotsUseCase";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";

export class GetSlotsController extends GenericActionController<GetSlotsRequest, GetSlotsUseCase> {}
