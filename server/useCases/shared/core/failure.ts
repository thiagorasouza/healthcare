import { Result } from "@/server/useCases/shared/core/result";

interface Error<T> {
  code: string;
  data: T;
}

export class Failure<T> extends Result {
  public readonly ok = false;
  public readonly error: Error<T>;

  public constructor(data: T) {
    super();
    this.error = {
      code: this.constructor.name,
      data,
    };
    Object.freeze(this);
  }
}
