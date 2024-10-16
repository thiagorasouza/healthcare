import { ActionController } from "@/server/shared/protocols/actionController";
import { UseCase } from "@/server/shared/protocols/useCase";

export class BypassController<K extends UseCase> implements ActionController {
  constructor(private readonly useCase: K) {}

  async handle() {
    return await this.useCase.execute();
  }
}
