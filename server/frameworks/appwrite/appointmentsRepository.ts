import { env } from "@/server/config/env";
import { Appointment } from "@/server/domain/appointment";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Appwritify } from "@/server/frameworks/appwrite/helpers";
import { Repository } from "@/server/frameworks/appwrite/repository";
import { AppointmentsRepositoryInterface } from "@/server/repositories/appointmentsRepository";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { Query } from "@/server/frameworks/appwrite/nodeClient";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";

export class AppointmentsRepository
  extends Repository<AppointmentModel>
  implements AppointmentsRepositoryInterface
{
  constructor() {
    super(env.appointmentsCollectionId);
  }

  public async createAppointment(appointment: Appointment) {
    return await this.createDocument(appointment.get());
  }

  public async getAppointmentsByPatientId(patientId: string) {
    const result = await this.listDocuments([Query.equal("patientId", patientId)]);
    if (result.total === 0) {
      return new NotFoundFailure(patientId);
    }

    const appointments = result.documents.map((ap) => this.map(ap as Appwritify<AppointmentModel>));

    return new FoundSuccess<AppointmentModel[]>(appointments);
  }

  public map(data: Appwritify<AppointmentModel>): AppointmentModel {
    return {
      id: data.$id,
      doctorId: data.doctorId,
      patientId: data.patientId,
      startTime: new Date(data.startTime),
      duration: data.duration,
    };
  }
}
