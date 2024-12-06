import { CookiesRepositoryInterface } from "@/server/repositories/cookiesRepository";
import { UsersRepositoryInterface } from "@/server/repositories/usersRepository";
import { Success } from "@/server/useCases/shared/core/success";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUseCase implements UseCase {
  public constructor(
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly cookiesRepository: CookiesRepositoryInterface,
  ) {}

  public async execute(
    request: LoginRequest,
  ): Promise<Success<string> | NotFoundFailure | ServerFailure> {
    const { email, password } = request;

    const loginResult = await this.usersRepository.login(email, password);
    if (!loginResult.ok) {
      return loginResult;
    }

    const session = loginResult.value;
    await this.cookiesRepository.set(session);

    return new Success("User logged in.");
  }
}
