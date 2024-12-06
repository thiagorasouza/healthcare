import { ADVANCE_UNIT, DURATION_UNIT, MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { Failure } from "@/server/useCases/shared/core/failure";
import {
  AppointmentTooShortFailure,
  AppointmentTooSoonFailure,
  DoctorNotFoundFailure,
  DoctorUnavailableFailure,
  PatientNotFoundFailure,
  PatientUnavailableFailure,
  ServerFailure,
} from "@/server/useCases/shared/failures";

export const errorMsgs = {
  [AppointmentTooSoonFailure.name]: `Appointment too soon. Please schedule your appointment at least ${MIN_ADVANCE} ${ADVANCE_UNIT} in advance.`,
  [AppointmentTooShortFailure.name]: `Appointment too short. Mininum appointment duration is configured to ${MIN_DURATION} ${DURATION_UNIT}.`,
  [DoctorNotFoundFailure.name]: "Doctor not found.",
  [PatientNotFoundFailure.name]: "Patient not found.",
  [DoctorUnavailableFailure.name]:
    "This doctor is currently unavailable at this day and hour. Please try getting an appointment in another hour or another day.",
  [PatientUnavailableFailure.name]:
    "This patient has appointment that conflict with the appointment you are trying to schedule. Please review your submission.",
  [ServerFailure.name]:
    "Our servers failed while trying to complete your request. Please try again once more. If this error keeps popping up, please try again later.",
};

export const displayError = <T>(failure?: Failure<T>): string => {
  return !!failure ? errorMsgs[failure.error.code] : "Unknown error";
};
