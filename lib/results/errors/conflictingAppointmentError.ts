import { error } from "../error";

export const conflictingAppointmentError = () =>
  error("Cannot create an appointment that conflicts with any other", undefined);
