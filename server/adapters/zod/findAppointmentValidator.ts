import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { FindAppointmentRequest } from "@/server/useCases/findAppointment/findAppointmentUseCase";
import { z } from "zod";

export const findAppointmentForm = z.object({
  email: z.string().email(),
  birthdate: z.coerce.date(),
});

export type FindAppointmentFormData = z.infer<typeof findAppointmentForm>;

export const findAppointmentValidator = new GenericValidator<FindAppointmentRequest>(
  findAppointmentForm,
);
