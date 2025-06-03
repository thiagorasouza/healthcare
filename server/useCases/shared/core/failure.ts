import { Result } from "@/server/useCases/shared/core/result";

interface Error<T> {
  code: string;
  data: T;
}

export class Failure<T> extends Result {
  public readonly ok = false;
  public readonly error: Error<T>;

  public constructor(code: string, data: T) {
    super();
    this.error = { code, data };
    Object.freeze(this);
  }
}
