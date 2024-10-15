import { env } from "@/server/config/env";
import { Appointment } from "@/server/domain/appointment";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Appwritify } from "@/server/frameworks/appwrite/appwriteHelpers";
import { AppwriteRepository } from "@/server/frameworks/appwrite/appwriteRepository";
import { AppointmentsRepository } from "@/server/repositories/appointmentsRepository";
import { ServerFailure } from "@/server/shared/failures";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";

export class AppwriteAppointmentsRepository
  extends AppwriteRepository<AppointmentModel>
  implements AppointmentsRepository
{
  constructor() {
    super(env.appointmentsCollectionId);
  }

  public async createAppointment(appointment: Appointment) {
    return new ServerFailure("");
  }

  public async getAppointmentsByPatientId(patientId: string) {
    return new NotFoundFailure(patientId);
  }

  public map(data: Appwritify<AppointmentModel>): AppointmentModel {
    return {
      doctorId: data.doctorId,
      patientId: data.patientId,
      startTime: new Date(data.startTime),
      duration: data.duration,
    };
  }
}
