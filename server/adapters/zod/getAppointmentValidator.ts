import { z } from "zod";
import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { GetAppointmentRequest } from "@/server/useCases/getAppointment/getAppointmentUseCase";

export const getAppointmentSchema = z.object({
  id: z.string(),
});

export const getAppointmentValidator = new GenericValidator<GetAppointmentRequest>(
  getAppointmentSchema,
);
