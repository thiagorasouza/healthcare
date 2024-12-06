import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { GetSlotsRequest } from "@/server/useCases/getDoctorSlots/getSlotsUseCase";
import { z } from "zod";

export const getSlotsSchema = z.object({
  doctorId: z.string(),
  startDate: z.coerce.date(),
});

export const getSlotsValidator = new GenericValidator<GetSlotsRequest>(getSlotsSchema);
