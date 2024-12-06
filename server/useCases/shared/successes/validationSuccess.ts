import { Success } from "@/server/useCases/shared/core/success";

export class ValidationSuccess<T> extends Success<T> {
  constructor(typedData: T) {
    super(typedData);
  }
}
