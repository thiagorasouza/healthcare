import { Success } from "@/server/useCases/shared/core/success";
import { FileModel } from "@/server/domain/models/fileModel";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";

export interface StorageRepositoryInterface {
  createDocument: (file: File) => Promise<Success<FileModel> | ServerFailure>;
  getDocument: (id: string) => Promise<Success<FileModel> | NotFoundFailure>;
  createImage: (file: File) => Promise<Success<FileModel> | ServerFailure>;
  getImage: (id: string) => Promise<Success<FileModel> | NotFoundFailure>;
}
