import { Appointment } from "@/server/domain/appointment";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Slots } from "@/server/domain/slots";
import {
  AppointmentsRepositoryInterface,
  DoctorsRepositoryInterface,
  PatientsRepositoryInterface,
  PatternsRepositoryInterface,
} from "@/server/repositories";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import {
  AppointmentTooShortFailure,
  AppointmentTooSoonFailure,
  DoctorUnavailableFailure,
  NotFoundFailure,
  PatientUnavailableFailure,
  ServerFailure,
} from "@/server/useCases/shared/failures";

export type UpdateAppointmentRequest = AppointmentModel;

export class UpdateAppointmentUseCase implements UseCase {
  public constructor(
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly patientsRepository: PatientsRepositoryInterface,
    private readonly patternsRepository: PatternsRepositoryInterface,
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
  ) {}

  public async execute(
    request: UpdateAppointmentRequest,
  ): Promise<
    | Success<AppointmentModel>
    | AppointmentTooSoonFailure
    | AppointmentTooShortFailure
    | DoctorUnavailableFailure
    | PatientUnavailableFailure
    | NotFoundFailure
    | ServerFailure
  > {
    try {
      const { id, patientId, doctorId, startTime, duration } = request;

      const appointmentResult = await this.appointmentsRepository.getById(id);
      if (!appointmentResult.ok) {
        return appointmentResult;
      }

      const current = appointmentResult.value;

      // if nothing has chaged, return success
      if (
        current.patientId === patientId &&
        current.doctorId === doctorId &&
        current.startTime.toISOString() === startTime.toISOString() &&
        current.duration === duration
      ) {
        return new Success(request);
      }

      const entity = new Appointment(request);

      // checks if appointment is too soon or too short
      if (current.startTime !== startTime || current.duration !== duration) {
        const validation = entity.validate();
        if (!validation.ok) {
          return validation;
        }
      }

      if (current.patientId !== patientId) {
        const patientExistsResult = await this.patientsRepository.getById(patientId);
        if (!patientExistsResult.ok) {
          return patientExistsResult;
        }
      }

      if (current.doctorId !== doctorId) {
        const doctorExistsResult = await this.doctorsRepository.getById(doctorId);
        if (!doctorExistsResult.ok) {
          return doctorExistsResult;
        }
      }

      const doctorUnavailableFailure = new DoctorUnavailableFailure();

      // checks if slot is valid
      if (
        current.doctorId !== doctorId ||
        current.startTime.toISOString() !== startTime.toISOString()
      ) {
        const patternsResult = await this.patternsRepository.listByDoctorId(doctorId);
        if (!patternsResult.ok) {
          return patternsResult;
        }

        const isSlotValid = new Slots()
          .source(patternsResult.value)
          .date(startTime)
          .parse()
          .isValid(startTime, duration);

        if (!isSlotValid) {
          return doctorUnavailableFailure;
        }

        const doctorAppointmentResult = await this.appointmentsRepository.getByDoctorIdAndStartTime(
          doctorId,
          startTime,
        );
        if (doctorAppointmentResult.ok && doctorAppointmentResult.value.length > 0) {
          return doctorUnavailableFailure;
        }
      }

      // checks if patient is available
      if (current.patientId !== patientId || current.startTime !== startTime) {
        const patientAppointmentsResult =
          await this.appointmentsRepository.getByPatientId(patientId);
        if (patientAppointmentsResult.ok) {
          const storedAppointments = patientAppointmentsResult.value;

          const conflictingAppointment = storedAppointments.find((ap) => entity.isConflicting(ap));
          if (conflictingAppointment) {
            return new PatientUnavailableFailure(patientId, startTime, conflictingAppointment);
          }
        }
      }

      const updateResult = await this.appointmentsRepository.update(id, {
        patientId,
        doctorId,
        startTime,
        duration,
      });
      if (!updateResult.ok) {
        return updateResult;
      }

      return updateResult;
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
