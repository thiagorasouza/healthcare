import { Success } from "@/server/core/success";
import { DoctorsRepositoryInterface } from "@/server/repositories";
import { ServerFailure } from "@/server/shared/failures";
import { UseCase } from "@/server/shared/protocols/useCase";

export class CountDoctorsUseCase implements UseCase {
  constructor(private readonly doctorsRepository: DoctorsRepositoryInterface) {}

  public async execute(): Promise<Success<number> | ServerFailure> {
    return await this.doctorsRepository.count();
  }
}
