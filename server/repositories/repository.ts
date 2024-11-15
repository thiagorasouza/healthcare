import { Success } from "@/server/core/success";
import { NotFoundFailure, ServerFailure } from "@/server/shared/failures";

export interface RepositoryInterface<T> {
  create(data: T): Promise<Success<T> | ServerFailure>;
  getById(id: string): Promise<Success<T> | NotFoundFailure>;
  count(): Promise<Success<number> | ServerFailure>;
  list(queries?: string[]): Promise<Success<T[]> | ServerFailure>;
  listByField(field?: string, values?: string[]): Promise<Success<T[]> | ServerFailure>;
  listByIds(values: string[]): Promise<Success<T[]> | ServerFailure>;
  delete(id: string): Promise<Success<string> | ServerFailure>;
}
