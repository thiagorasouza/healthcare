import { Failure } from "@/server/core/failure";

export class NotFoundFailure extends Failure<string> {
  constructor(id: string) {
    super(id);
  }
}
