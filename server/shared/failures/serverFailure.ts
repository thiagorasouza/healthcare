import { Failure } from "@/server/core/failure";

export class ServerFailure extends Failure<string> {
  constructor(msg: string) {
    super(msg);
  }
}
