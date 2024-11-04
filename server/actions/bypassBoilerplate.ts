import { BypassController } from "@/server/useCases/shared/BypassController";
import { BypassUseCase } from "@/server/useCases/shared/BypassUseCase";

export async function bypassBoilerplate<T, K>(repository: T, method: keyof T) {
  const useCase = new BypassUseCase(repository, method);
  const controller = new BypassController(useCase);

  const result = (await controller.handle()) as K;
  const plainObject = Object.assign({}, result);
  return plainObject;
}
