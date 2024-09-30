import { Success } from "@/server/core/success";

export class FoundSuccess<T> extends Success<T> {
  constructor(model: T) {
    super(model);
  }
}
