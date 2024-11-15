import { Success } from "@/server/core/success";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { RepositoryInterface } from "@/server/repositories/repository";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { CreatedSuccess } from "@/server/shared/successes/createdSuccess";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";

type T = AppointmentModel;

export interface AppointmentsRepositoryInterface extends RepositoryInterface<T> {
  getByDoctorId(doctorId: string): Promise<Success<T[]> | ServerFailure>;
  getByDoctorIdAndStartTime(
    doctorId: string,
    startTime: Date,
  ): Promise<FoundSuccess<T[]> | NotFoundFailure>;
  getByPatientId(patientId: string): Promise<FoundSuccess<T[]> | NotFoundFailure>;
}
