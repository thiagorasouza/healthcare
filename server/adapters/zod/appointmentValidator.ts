import { z } from "zod";
import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export const appointmentsSchema = z.object({
  doctorId: z.string(),
  patientId: z.string(),
  startTime: z.coerce.date(),
  duration: z.coerce.number(),
});

export const appointmentValidator = new GenericValidator<AppointmentModel>(appointmentsSchema);
