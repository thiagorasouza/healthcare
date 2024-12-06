import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { RecoverAppointmentRequest } from "@/server/useCases/recoverAppointment/recoverAppointmentUseCase";
import { z } from "zod";

export const recoverAppointmentSchema = z.object({
  email: z.string().email(),
  birthdate: z.coerce.date(),
});

export const recoverAppointmentValidator = new GenericValidator<RecoverAppointmentRequest>(
  recoverAppointmentSchema,
);
