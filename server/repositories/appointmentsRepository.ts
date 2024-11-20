import { Success } from "@/server/core/success";
import { AppointmentData } from "@/server/domain/models/appointmentData";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { RepositoryInterface } from "@/server/repositories/repository";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";

type Model = AppointmentModel;

export interface AppointmentsRepositoryInterface extends RepositoryInterface<Model> {
  getByDoctorId(doctorId: string): Promise<Success<Model[]> | ServerFailure>;
  getByDoctorIdAndStartTime(
    doctorId: string,
    startTime: Date,
  ): Promise<FoundSuccess<Model[]> | NotFoundFailure>;
  getByPatientId(patientId: string): Promise<FoundSuccess<Model[]> | NotFoundFailure>;
}
