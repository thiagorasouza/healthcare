import { Success } from "@/server/core/success";
import { ServerFailure } from "@/server/shared/failures";

export interface EmailsRepositoryInterface {
  send: (to: string, subject: string, body: string) => Promise<Success<string> | ServerFailure>;
}
