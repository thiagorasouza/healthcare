import { Success } from "@/server/useCases/shared/core/success";
import { FileModel } from "@/server/domain/models/fileModel";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export interface StorageRepositoryInterface {
  create: (file: File) => Promise<Success<FileModel> | ServerFailure>;
  get: (id: string) => Promise<Success<FileModel> | NotFoundFailure>;
}
