import { Failure } from "@/server/core/failure";

export class LogicFailure extends Failure<string[]> {
  constructor(params: string[]) {
    super(params);
  }
}
