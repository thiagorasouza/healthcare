import { SessionModel } from "@/server/domain/models/sessionModel";
import { Success } from "@/server/useCases/shared/core/success";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { InvalidCredentialsFailure } from "@/server/useCases/shared/failures/invalidCredentialsFailure";

export interface UsersRepositoryInterface {
  login(
    email: string,
    password: string,
  ): Promise<Success<SessionModel> | InvalidCredentialsFailure | ServerFailure>;
  logout: () => Promise<Success<string> | ServerFailure>;
}
