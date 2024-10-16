import { UseCase } from "@/server/shared/protocols/useCase";

export class BypassUseCase<T> implements UseCase {
  constructor(
    private readonly repository: T,
    private readonly method: keyof T,
  ) {}

  public async execute() {
    //@ts-ignore
    return await this.repository[this.method]();
  }
}
