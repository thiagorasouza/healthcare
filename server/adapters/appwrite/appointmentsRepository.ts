import { env } from "@/server/config/env";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Appwritify } from "@/server/adapters/appwrite/helpers";
import { Repository } from "@/server/adapters/appwrite/repository";
import { Query } from "@/server/adapters/appwrite/nodeClient";
import { AppointmentsRepositoryInterface } from "@/server/repositories";

export class AppointmentsRepository
  extends Repository<AppointmentModel>
  implements AppointmentsRepositoryInterface
{
  constructor() {
    super(env.appointmentsCollectionId);
  }

  public async getByPatientId(patientId: string) {
    return this.listByField("patientId", [patientId]);
  }

  public async getByDoctorId(doctorId: string) {
    return this.listByField("doctorId", [doctorId]);
  }

  public async getByDoctorIdAndStartTime(doctorId: string, startTime: Date) {
    return this.list([
      Query.and([
        Query.equal("doctorId", doctorId),
        Query.equal("startTime", startTime.toISOString()),
      ]),
    ]);
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
