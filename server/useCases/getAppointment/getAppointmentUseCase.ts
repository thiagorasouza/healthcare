import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import {
  AppointmentsRepositoryInterface,
  DoctorsRepositoryInterface,
  PatientsRepositoryInterface,
} from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export interface GetAppointmentRequest {
  id: string;
}

export class GetAppointmentsUseCase implements UseCase {
  public constructor(
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly patientsRepository: PatientsRepositoryInterface,
  ) {}

  public async execute(
    request: GetAppointmentRequest,
  ): Promise<Success<AppointmentHydrated> | NotFoundFailure | ServerFailure> {
    try {
      const { id } = request;

      const appointmentResult = await this.appointmentsRepository.getById(id);
      if (!appointmentResult.ok) {
        return appointmentResult;
      }
      const { startTime, duration, doctorId, patientId } = appointmentResult.value;

      const doctorResult = await this.doctorsRepository.getById(doctorId);
      if (!doctorResult.ok) {
        return doctorResult;
      }
      const doctor = doctorResult.value;

      const patientResult = await this.patientsRepository.getById(patientId);
      if (!patientResult.ok) {
        return patientResult;
      }
      const patient = patientResult.value;

      const hydratedAppointment: AppointmentHydrated = {
        id,
        startTime,
        duration,
        doctor,
        patient,
      };

      return new Success(hydratedAppointment);
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
