import { ADVANCE_UNIT, DURATION_UNIT, MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { Failure } from "@/server/useCases/shared/core/failure";
import {
  AppointmentTooShortFailure,
  AppointmentTooSoonFailure,
  DoctorNotFoundFailure,
  DoctorUnavailableFailure,
  InvalidCredentialsFailure,
  NotFoundFailure,
  PatientNotFoundFailure,
  PatientUnavailableFailure,
  ServerFailure,
  ValidationFailure,
} from "@/server/useCases/shared/failures";
import { ConflictingPatternsFailure } from "@/server/useCases/shared/failures/ConflictingPatternsFailure";
import { ForbiddenInTestingFailure } from "@/server/useCases/shared/failures/forbiddenInTestingFailure";

export const errorMsgs = {
  [AppointmentTooSoonFailure.name]: `Appointment too soon. Please schedule your appointment at least ${MIN_ADVANCE} ${ADVANCE_UNIT} in advance.`,
  [AppointmentTooShortFailure.name]: `Appointment too short. Mininum appointment duration is configured to ${MIN_DURATION} ${DURATION_UNIT}.`,
  [DoctorNotFoundFailure.name]: "Doctor not found.",
  [PatientNotFoundFailure.name]: "Patient not found.",
  [NotFoundFailure.name]: "Not found.",
  [DoctorUnavailableFailure.name]:
    "This doctor is currently unavailable at this day and hour. Please try getting an appointment in another hour or another day.",
  [PatientUnavailableFailure.name]:
    "This patient has appointment that conflict with the appointment you are trying to schedule. Please review your submission.",
  [ServerFailure.name]:
    "Our servers failed while trying to complete your request. If this error keeps popping up, please try again later.",
  [InvalidCredentialsFailure.name]: "Invalid email or password.",
  [ForbiddenInTestingFailure.name]:
    "To keep this demo usable, testing users cannot manipulate doctors or delete data.",
  [ConflictingPatternsFailure.name]:
    "The pattern you are trying to create conflicts with another existing one.",
  [ValidationFailure.name]: "Please fill all the fields properly.",
};

export const displayError = <T>(failure?: Failure<T>): string => {
  return !!failure ? errorMsgs[failure.error.code] : "Unknown error";
};
