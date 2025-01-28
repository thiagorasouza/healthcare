import { env } from "@/server/config/env";
import { Success } from "@/server/useCases/shared/core/success";
import { FileModel } from "@/server/domain/models/fileModel";
import { AppwritifyFile } from "@/server/adapters/appwrite/helpers";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { StorageRepositoryInterface } from "@/server/repositories";
import { ID, Storage, storage } from "@/server/adapters/appwrite/nodeClient";

export class StorageRepository implements StorageRepositoryInterface {
  storage: Storage;
  docsBucketId: string;
  imagesBucketId: string;

  public constructor() {
    this.storage = storage;
    this.docsBucketId = env.docsBucketId;
    this.imagesBucketId = env.imagesBucketId;
  }

  public async createDocument(file: File) {
    return await this.create(this.docsBucketId, file);
  }

  public async getDocument(id: string) {
    return await this.get(this.docsBucketId, id);
  }

  public async createImage(file: File) {
    return await this.create(this.imagesBucketId, file);
  }

  public async getImage(id: string) {
    return await this.get(this.imagesBucketId, id);
  }

  protected async create(bucket: string, file: File) {
    try {
      const result = (await this.storage.createFile(
        bucket,
        ID.unique(),
        file,
      )) as AppwritifyFile<FileModel>;

      return new Success(this.map(result));
    } catch (error) {
      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }

  protected async get(bucket: string, id: string) {
    try {
      const result = (await this.storage.getFile(bucket, id)) as AppwritifyFile<FileModel>;
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
