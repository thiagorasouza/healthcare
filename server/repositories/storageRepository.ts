import { Success } from "@/server/core/success";
import { FileModel } from "@/server/domain/models/fileModel";
import { ServerFailure } from "@/server/shared/failures";

export interface StorageRepositoryInterface {
  create: (file: File) => Promise<Success<FileModel> | ServerFailure>;
}
