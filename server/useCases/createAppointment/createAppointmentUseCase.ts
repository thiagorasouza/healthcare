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
    const { doctorId, patientId, startTime } = request;

    const doctorExistsResult = await this.doctorsRepository.getDoctorById(doctorId);
    if (!doctorExistsResult.ok) {
      return doctorExistsResult;
    }

    const patientExistsResult = await this.patientsRepository.getPatientById(patientId);
    if (!patientExistsResult.ok) {
      return patientExistsResult;
    }

    const doctorUnavailableFailure = new DoctorUnavailableFailure(doctorId, startTime);

    const patternsResult = await this.patternsRepository.getPatternsByDoctorId(doctorId);
    if (!patternsResult.ok) {
      return doctorUnavailableFailure;
    }

    const isDoctorAvailable = new Slots()
      .source(patternsResult.value)
      .date(startTime)
      .parse()
      .isValid(startTime);

    if (!isDoctorAvailable) {
      return doctorUnavailableFailure;
    }

    const appointmentsResult =
      await this.appointmentsRepository.getAppointmentsByPatientId(patientId);

    if (appointmentsResult.ok) {
      const storedAppointments = appointmentsResult.value;

      const anyConflict = storedAppointments.some((ap) => currentAppointment.isConflicting(ap));
      if (anyConflict) {
        return new PatientUnavailableFailure(patientId, startTime);
      }
    }

    const createAppointmentResult =
      await this.appointmentsRepository.createAppointment(currentAppointment);

    return createAppointmentResult;
  }
}
