import { error } from "../error";

export const userAlreadyRegisteredError = () =>
  error("User already registered");
