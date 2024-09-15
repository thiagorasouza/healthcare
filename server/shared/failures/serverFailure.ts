import { Failure } from "@/server/core/failure";

export class ServerFailure extends Failure<any> {
  constructor(msg: any) {
    super(msg);
  }
}
