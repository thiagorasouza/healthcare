import { Failure } from "@/server/useCases/shared/core/failure";

export class ServerFailure extends Failure<any> {
  constructor(msg: any) {
    super(msg);
  }
}
