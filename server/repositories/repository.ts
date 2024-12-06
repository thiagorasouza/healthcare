import { Success } from "@/server/useCases/shared/core/success";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export interface RepositoryInterface<Model> {
  create(data: Omit<Model, "id">): Promise<Success<Model> | ServerFailure>;
  getById(id: string): Promise<Success<Model> | NotFoundFailure>;
  count(): Promise<Success<number> | ServerFailure>;
  list(queries?: string[]): Promise<Success<Model[]> | ServerFailure>;
  listByField(field?: string, values?: string[]): Promise<Success<Model[]> | ServerFailure>;
  listByIds(values: string[]): Promise<Success<Model[]> | ServerFailure>;
  delete(id: string): Promise<Success<string> | ServerFailure>;
}
