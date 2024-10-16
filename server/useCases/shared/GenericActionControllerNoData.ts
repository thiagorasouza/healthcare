import { ActionController } from "@/server/shared/protocols/actionController";
import { UseCase } from "@/server/shared/protocols/useCase";

export class GenericActionControllerNoData<K extends UseCase> implements ActionController {
  constructor(private readonly useCase: K) {}

  async handle(): Promise<ReturnType<K["execute"]>> {
    return this.useCase.execute(undefined);
  }
}
