import { Success } from "@/server/useCases/shared/core/success";
import { ServerFailure } from "@/server/useCases/shared/failures";

export interface EmailsRepositoryInterface {
  send: (to: string, subject: string, body: string) => Promise<Success<string> | ServerFailure>;
}
