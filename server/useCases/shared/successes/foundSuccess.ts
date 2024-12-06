import { Success } from "@/server/useCases/shared/core/success";

export class FoundSuccess<T> extends Success<T> {
  constructor(model: T) {
    super(model);
  }
}
