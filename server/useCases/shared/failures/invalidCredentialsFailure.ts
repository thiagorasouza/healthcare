import { Failure } from "@/server/useCases/shared/core/failure";

export class InvalidCredentialsFailure extends Failure<string> {
  constructor() {
    super("InvalidCredentialsFailure", "Invalid credentials");
  }
}
