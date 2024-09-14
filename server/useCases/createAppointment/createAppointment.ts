import { Appointment } from "@/server/domain/appointment";
import { Slots } from "@/server/domain/slots";
import { AppointmentsRepository } from "@/server/repositories/appointmentsRepository";
import { DoctorsRepository } from "@/server/repositories/doctorsRepository";
import { PatientsRepository } from "@/server/repositories/patientsRepository";
import { PatternsRepository } from "@/server/repositories/patternsRepository";
import { AppointmentTooShortFailure } from "@/server/shared/failures/appointmentTooShortFailure";
import { AppointmentTooSoonFailure } from "@/server/shared/failures/appointmentTooSoonFailure";
import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { DoctorUnavailableFailure } from "@/server/shared/failures/doctorUnavailableFailure";
import { PatientNotFoundFailure } from "@/server/shared/failures/patientNotFoundFailure";
import { PatientUnavailableFailure } from "@/server/shared/failures/patientUnavailableFailure";
import { ServerFailure } from "@/server/shared/failures/serverFailure";
import { UseCase } from "@/server/shared/protocols/useCase";
import { AppointmentCreatedSuccess } from "@/server/shared/successes/appointmentCreatedSuccess";

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

export class CreateAppointment implements UseCase {
  constructor(
    private readonly doctorsRepository: DoctorsRepository,
    private readonly patientsRepository: PatientsRepository,
    private readonly patternsRepository: PatternsRepository,
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute(
    request: CreateAppointmentRequest,
  ): Promise<
    | AppointmentCreatedSuccess
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

    const { doctorId, patientId, startTime } = request;
    const appointment = appointmentValidation.value;

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

    // const slots = Slots.read(patternsResult.value, { exactDate: startTime });
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

      const anyConflict = storedAppointments.some((ap) => appointment.isConflicting(ap));
      if (anyConflict) {
        return new PatientUnavailableFailure(patientId, startTime);
      }
    }

    const createAppointmentResult =
      await this.appointmentsRepository.createAppointment(appointment);

    return createAppointmentResult;
  }
}
