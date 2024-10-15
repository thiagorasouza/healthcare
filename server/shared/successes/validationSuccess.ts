import { Success } from "@/server/core/success";

export class ValidationSuccess<T> extends Success<T> {
  constructor(typedData: T) {
    super(typedData);
  }
}
