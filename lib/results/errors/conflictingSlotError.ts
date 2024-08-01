import { error } from "../error";

export const conflictingSlotError = () =>
  error("Cannot create a slot that conflicts with any other");
