import { env } from "@/server/config/env";
import { Success } from "@/server/core/success";
import { Appwritify, isAppwriteException } from "@/server/frameworks/appwrite/helpers";
import { databases, Databases, ID, Query } from "@/server/frameworks/appwrite/nodeClient";
import { ServerFailure } from "@/server/shared/failures";
import { NotFoundFailure } from "@/server/shared/failures/notFoundFailure";
import { CreatedSuccess } from "@/server/shared/successes/createdSuccess";
import { FoundSuccess } from "@/server/shared/successes/foundSuccess";

export abstract class Repository<Model> {
  private readonly db: Databases;
  private readonly databaseId: string;
  private readonly collectionId: string;

  constructor(collectionId: string) {
    this.db = databases;
    this.databaseId = env.databaseId;
    this.collectionId = collectionId;
  }

  public abstract map(data: Appwritify<Model>): Model;

  public async create(data: Omit<Model, "id">, permissions?: string[]) {
    try {
      const result = (await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        data,
        permissions,
      )) as Appwritify<Model>;

      return new CreatedSuccess<Model>(this.map(result));
    } catch (error) {
      return new ServerFailure(error);
    }
  }

  public async getById(id: string): Promise<FoundSuccess<Model> | NotFoundFailure> {
    try {
      const result = (await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id,
      )) as Appwritify<Model>;

      return new Success<Model>(this.map(result));
    } catch (error) {
      if (isAppwriteException(error) && error.type === "document_not_found") {
        return new NotFoundFailure(id);
      }

      return new ServerFailure(error);
    }
  }

  public async count() {
    try {
      const result = await this.listDocuments([Query.limit(1)]);
      return new Success(result.total);
    } catch (error) {
      return new ServerFailure(error);
    }
  }

  public async list(queries?: string[]) {
    try {
      const result = await this.listDocuments(queries);
      const mappedDocuments = result.documents.map((doc) => this.map(doc as Appwritify<Model>));
      return new Success(mappedDocuments);
    } catch (error) {
      return new ServerFailure(error);
    }
  }

  public async listByField(field?: string, values?: string[]) {
    const query = field && values ? [Query.equal(field, values)] : undefined;
    return this.list(query);
  }

  public async listByIds(values: string[]) {
    return this.listByField("$id", values);
  }

  protected async listDocuments(queries?: string[]) {
    return await this.db.listDocuments(this.databaseId, this.collectionId, queries);
  }

  public async updateDocument(id: string, data: any, permissions?: string[]) {
    return await this.db.updateDocument(this.databaseId, this.collectionId, id, data, permissions);
  }

  public async deleteDocument(id: string) {
    return await this.db.deleteDocument(this.databaseId, this.collectionId, id);
  }
}
