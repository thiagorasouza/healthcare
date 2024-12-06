import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { SendConfirmationRequest } from "@/server/useCases/sendConfirmation/sendConfirmationUseCase";
import { z } from "zod";

export const sendConfirmationSchema = z.object({
  email: z.string().email(),
  appointmentId: z.string(),
});

export const sendConfirmationValidator = new GenericValidator<SendConfirmationRequest>(
  sendConfirmationSchema,
);
