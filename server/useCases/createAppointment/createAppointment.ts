import { Appointment } from "@/server/domain/appointment";
import { Slots } from "@/server/domain/slots";
import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { DoctorUnavailableFailure } from "@/server/shared/failures/doctorUnavailableFailure";
import { LogicFailure } from "@/server/shared/failures/logicFailure";
import { PatientNotFoundFailure } from "@/server/shared/failures/patientNotFoundFailure";
import { PatientUnavailableFailure } from "@/server/shared/failures/patientUnavailableFailure";
import { UseCase } from "@/server/shared/protocols/useCase";
import { AppointmentCreatedSuccess } from "@/server/shared/successes/appointmentCreatedSuccess";
import { CreateAppointmentRepository } from "@/server/useCases/createAppointment/createAppointmentRepository";

export interface CreateAppointmentRequest {
  doctorId: string;
  patientId: string;
  startTime: Date;
}

// algorithm
// 1. validate appointment logic
// 2. check if doctor exists
// 3. check if patient exists
// 4. check if appointment time is possibile for this doctor
// 5. check if appointment time is possibile for this patient
// 6. save appointment data

export class CreateAppointment implements UseCase {
  constructor(private readonly repository: CreateAppointmentRepository) {}

  async execute(
    request: CreateAppointmentRequest,
  ): Promise<
    | AppointmentCreatedSuccess
    | LogicFailure
    | DoctorNotFoundFailure
    | PatientNotFoundFailure
    | DoctorUnavailableFailure
    | PatientUnavailableFailure
  > {
    const validateLogicResult = Appointment.create(request);
    if (!validateLogicResult.ok) {
      return validateLogicResult;
    }

    const { doctorId, patientId, startTime } = request;

    const doctorExistsResult = await this.repository.getDoctorById(doctorId);
    if (!doctorExistsResult.ok) {
      return doctorExistsResult;
    }

    const patientExistsResult = await this.repository.getPatientById(patientId);
    if (!patientExistsResult.ok) {
      return patientExistsResult;
    }

    const doctorUnavailableFailure = new DoctorUnavailableFailure(doctorId, startTime);

    const patternsResult = await this.repository.getPatternsByDoctorId(doctorId);
    if (!patternsResult.ok) {
      return doctorUnavailableFailure;
    }

    // const slots = Slots.read(patternsResult.value, { exactDate: startTime });
    const isDoctorAvailable = new Slots()
      .source(patternsResult.value)
      .date(startTime)
      .parse()
      .isValid(startTime);

    // if(!isDoctorAvailable) {
    //   return doctorUnavailableFailure;
    // }

    return new AppointmentCreatedSuccess(request);
  }
}
