import { Success } from "@/server/useCases/shared/core/success";

export class CreatedSuccess<T> extends Success<T> {
  constructor(data: T) {
    super(data);
  }
}
