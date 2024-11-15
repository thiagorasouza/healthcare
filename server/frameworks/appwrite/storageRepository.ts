import { storage, Storage, ID } from "@/lib/appwrite/adminClient";
import { env } from "@/server/config/env";
import { Success } from "@/server/core/success";
import { FileModel } from "@/server/domain/models/fileModel";
import { AppwritifyFile } from "@/server/frameworks/appwrite/helpers";
import { StorageRepositoryInterface } from "@/server/repositories";
import { ServerFailure } from "@/server/shared/failures";

export class StorageRepository implements StorageRepositoryInterface {
  storage: Storage;
  bucketId: string;

  public constructor() {
    this.storage = storage;
    this.bucketId = env.docsBucketId;
  }

  public async create(file: File) {
    try {
      const result = (await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file,
      )) as AppwritifyFile<FileModel>;

      return new Success(this.map(result));
    } catch (error) {
      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }

  public map(data: AppwritifyFile<FileModel>): FileModel {
    return {
      id: data.$id,
      bucketId: data.bucketId,
      name: data.name,
      signature: data.signature,
      mimeType: data.mimeType,
      size: data.sizeOriginal,
    };
  }
}
