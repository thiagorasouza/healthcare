import { Appointment } from "@/server/domain/appointment";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Slots } from "@/server/domain/slots";
import {
  DoctorsRepositoryInterface,
  PatientsRepositoryInterface,
  PatternsRepositoryInterface,
  AppointmentsRepositoryInterface,
} from "@/server/repositories";
import {
  AppointmentTooShortFailure,
  AppointmentTooSoonFailure,
  DoctorNotFoundFailure,
  DoctorUnavailableFailure,
  PatientNotFoundFailure,
  PatientUnavailableFailure,
  ServerFailure,
} from "@/server/shared/failures";
import { UseCase } from "@/server/shared/protocols/useCase";
import { CreatedSuccess } from "@/server/shared/successes/createdSuccess";

export interface CreateAppointmentRequest {
  doctorId: string;
  patientId: string;
  startTime: Date;
  duration: number;
}

// algorithm
// 1. validate appointment logic
// 2. check if doctor exists
// 3. check if patient exists
// 4. check if appointment time is possibile for this doctor
// 5. check if appointment time is possibile for this patient
// 6. save appointment data

export class CreateAppointmentUseCase implements UseCase {
  constructor(
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly patientsRepository: PatientsRepositoryInterface,
    private readonly patternsRepository: PatternsRepositoryInterface,
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
  ) {}

  async execute(
    request: CreateAppointmentRequest,
  ): Promise<
    | CreatedSuccess<AppointmentModel>
    | AppointmentTooSoonFailure
    | AppointmentTooShortFailure
    | DoctorNotFoundFailure
    | PatientNotFoundFailure
    | DoctorUnavailableFailure
    | PatientUnavailableFailure
    | ServerFailure
  > {
    const appointmentValidation = new Appointment(request).validate();
    if (!appointmentValidation.ok) {
      return appointmentValidation;
    }

    const currentAppointment = appointmentValidation.value;
    const { doctorId, patientId, startTime, duration } = request;

    const doctorExistsResult = await this.doctorsRepository.getById(doctorId);
    if (!doctorExistsResult.ok) {
      return new DoctorNotFoundFailure(doctorId);
    }

    const patientExistsResult = await this.patientsRepository.getById(patientId);
    if (!patientExistsResult.ok) {
      return new PatientNotFoundFailure(patientId);
    }

    const doctorUnavailableFailure = new DoctorUnavailableFailure(doctorId, startTime);

    const doctorPatternsResult = await this.patternsRepository.getByDoctorId(doctorId);
    if (!doctorPatternsResult.ok) {
      return doctorUnavailableFailure;
    }

    const isSlotValid = new Slots()
      .source(doctorPatternsResult.value)
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
    if (doctorAppointmentResult.ok) {
      return doctorUnavailableFailure;
    }

    const patientAppointmentsResult = await this.appointmentsRepository.getByPatientId(patientId);

    if (patientAppointmentsResult.ok) {
      const storedAppointments = patientAppointmentsResult.value;

      const conflictingAppointment = storedAppointments.find((ap) =>
        currentAppointment.isConflicting(ap),
      );
      if (conflictingAppointment) {
        return new PatientUnavailableFailure(patientId, startTime, conflictingAppointment);
      }
    }

    const createAppointmentResult = await this.appointmentsRepository.create(
      currentAppointment.get(),
    );

    return createAppointmentResult;
  }
}
