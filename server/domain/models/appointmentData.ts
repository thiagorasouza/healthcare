import { AppointmentModel } from "@/server/domain/models/appointmentModel";

export type AppointmentData = Omit<AppointmentModel, "id">;
