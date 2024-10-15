import { env } from "@/server/config/env";
import { Appwritify, isAppwriteException } from "@/server/frameworks/appwrite/appwriteHelpers";
import { databases, Databases, ID } from "@/server/frameworks/appwrite/appwriteNodeClient";
import { ServerFailure } from "@/server/shared/failures";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { CreatedSuccess } from "@/server/shared/successes/createdSuccess";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";

export abstract class AppwriteRepository<T> {
  private readonly db: Databases;
  private readonly databaseId: string;
  private readonly collectionId: string;

  constructor(collectionId: string) {
    this.db = databases;
    this.databaseId = env.databaseId;
    this.collectionId = collectionId;
  }

  public abstract map(data: Appwritify<T>): T;

  public async createDocument(data: Omit<T, "id">, permissions?: string[]) {
    try {
      const result = (await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        data,
        permissions,
      )) as Appwritify<T>;

      return new CreatedSuccess<T>(this.map(result));
    } catch (error) {
      return new ServerFailure(error);
    }
  }

  public async getDocument(id: string) {
    try {
      return await this.db.getDocument(this.databaseId, this.collectionId, id);
    } catch (error) {
      if (isAppwriteException(error) && error.type === "document_not_found") {
        return null;
      }

      throw error;
    }
  }

  public async getDocumentById(id: string): Promise<FoundSuccess<T> | NotFoundFailure> {
    try {
      const result = (await this.getDocument(id)) as Appwritify<T>;
      if (!result) {
        return new NotFoundFailure(id);
      }

      return new FoundSuccess<T>(this.map(result));
    } catch (error) {
      return new ServerFailure(error);
    }
  }

  public async listDocuments(queries: string[]) {
    return await this.db.listDocuments(this.databaseId, this.collectionId, queries);
  }

  public async updateDocument(id: string, data: any, permissions?: string[]) {
    return await this.db.updateDocument(this.databaseId, this.collectionId, id, data, permissions);
  }

  public async deleteDocument(id: string) {
    return await this.db.deleteDocument(this.databaseId, this.collectionId, id);
  }
}
