import { DoctorNotFoundFailure } from "@/server/shared/failures/doctorNotFoundFailure";
import { DoctorUnavailableFailure } from "@/server/shared/failures/doctorUnavailableFailure";
import { PatientNotFoundFailure } from "@/server/shared/failures/patientNotFoundFailure";
import { PatientUnavailableFailure } from "@/server/shared/failures/patientUnavailableFailure";
import { ValidationFailure } from "@/server/shared/failures/validationFailure";
import { UseCase } from "@/server/shared/protocols/useCase";
import { AppointmentCreatedSuccess } from "@/server/shared/successes/appointmentCreatedSuccess";

export interface CreateAppointmentRequest {
  doctorId: string;
  patientId: string;
  startTime: Date;
}

export type CreateAppointmentResponse =
  | AppointmentCreatedSuccess
  | ValidationFailure
  | DoctorNotFoundFailure
  | PatientNotFoundFailure
  | DoctorUnavailableFailure
  | PatientUnavailableFailure;

// algorithm
// 1. validate input data
// 2. check if doctor exists
// 3. check if patient exists
// 4. check if appointment time is possibile for this doctor
// 5. check if appointment time is possibile for this patient
// 6. save appointment data

export class CreateAppointment implements UseCase {
  async execute(request: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    return new AppointmentCreatedSuccess(request);
  }
}
