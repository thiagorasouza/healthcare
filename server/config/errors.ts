import { ADVANCE_UNIT, DURATION_UNIT, MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { Failure } from "@/server/useCases/shared/core/failure";

export const errorMsgs: Record<string, string> = {
  AppointmentTooSoonFailure: `Appointment too soon. Please schedule your appointment at least ${MIN_ADVANCE} ${ADVANCE_UNIT} in advance.`,
  AppointmentTooShortFailure: `Appointment too short. Mininum appointment duration is configured to ${MIN_DURATION} ${DURATION_UNIT}.`,
  DoctorNotFoundFailure: "Doctor not found.",
  PatientNotFoundFailure: "Patient not found.",
  NotFoundFailure: "Not found.",
  DoctorUnavailableFailure:
    "This doctor is currently unavailable at this day and hour. Please try getting an appointment in another hour or another day.",
  PatientUnavailableFailure:
    "This patient has appointment that conflict with the appointment you are trying to schedule. Please review your submission.",
  ServerFailure:
    "Our servers failed while trying to complete your request. If this error keeps popping up, please try again later.",
  InvalidCredentialsFailure: "Invalid email or password.",
  ForbiddenInTestingFailure:
    "To keep this demo usable, testing users cannot manipulate doctors or delete data.",
  ConflictingPatternsFailure:
    "The pattern you are trying to create conflicts with another existing one.",
  ValidationFailure: "Please fill all the fields properly.",
};

export const displayError = <T>(failure?: Failure<T>): string => {
  if (!failure) {
    return "Unknown error";
  }

  const code = failure.error.code;
  const errorMsg = Object.hasOwn(errorMsgs, code) ? errorMsgs[code] : "Unknown error";

  return errorMsg;
};
