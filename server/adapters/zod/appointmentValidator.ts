import { z } from "zod";
import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { UpdateAppointmentRequest } from "@/server/useCases/updateAppointment/updateAppointmentUseCase";

export const appointmentsSchema = z.object({
  doctorId: z.string(),
  patientId: z.string(),
  startTime: z.coerce.date(),
  duration: z.coerce.number(),
});

export const appointmentValidator = new GenericValidator<AppointmentModel>(appointmentsSchema);

export const updateAppointmentSchema = appointmentsSchema.extend({
  id: z.string(),
});

export const updateAppointmentValidator = new GenericValidator<UpdateAppointmentRequest>(
  updateAppointmentSchema,
);
