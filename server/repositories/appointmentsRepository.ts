import { Success } from "@/server/useCases/shared/core/success";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { NotFoundFailure } from "@/server/useCases/shared/failures/notFoundFailure";
import { ServerFailure } from "@/server/useCases/shared/failures/serverFailure";
import { FoundSuccess } from "@/server/useCases/shared/successes/foundSuccess";
import { RepositoryInterface } from "@/server/repositories/repository";

type Model = AppointmentModel;

export interface AppointmentsRepositoryInterface extends RepositoryInterface<Model> {
  getByDoctorId(doctorId: string): Promise<Success<Model[]> | ServerFailure>;
  getByDoctorIdAndStartTime(
    doctorId: string,
    startTime: Date,
  ): Promise<FoundSuccess<Model[]> | NotFoundFailure>;
  getByPatientId(patientId: string): Promise<FoundSuccess<Model[]> | NotFoundFailure>;
}
