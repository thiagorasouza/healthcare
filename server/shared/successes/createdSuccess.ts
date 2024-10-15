import { Success } from "@/server/core/success";

export class CreatedSuccess<T> extends Success<T> {
  constructor(data: T) {
    super(data);
  }
}
