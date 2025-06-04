import { env } from "@/server/config/env";
import { Success } from "@/server/useCases/shared/core/success";
import { Appwritify, isAppwriteException } from "@/server/adapters/appwrite/helpers";
import { databases, Databases, ID, Query } from "@/server/adapters/appwrite/nodeClient";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { NotFoundFailure } from "@/server/useCases/shared/failures/notFoundFailure";
import { CreatedSuccess } from "@/server/useCases/shared/successes/createdSuccess";
import { FoundSuccess } from "@/server/useCases/shared/successes/foundSuccess";
import { RepositoryInterface } from "@/server/repositories";

export abstract class Repository<Model> implements RepositoryInterface<Model> {
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
      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }

  public async update(id: string, data: Partial<Omit<Model, "id">>, permissions?: string[]) {
    try {
      const result = (await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        data,
        permissions,
      )) as Appwritify<Model>;

      return new Success<Model>(this.map(result));
    } catch (error) {
      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }

  public async getById(id: string): Promise<FoundSuccess<Model> | NotFoundFailure> {
    try {
      const result = (await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id,
      )) as Appwritify<Model>;
      // console.log("🚀 ~ Repository<Model> ~ getById ~ result:", result);

      return new Success<Model>(this.map(result));
    } catch (error) {
      if (isAppwriteException(error) && error.type === "document_not_found") {
        return new NotFoundFailure("document");
      }

      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }

  public async count() {
    try {
      const result = await this.listDocuments([Query.limit(1)]);
      return new Success(result.total);
    } catch (error) {
      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }

  public async list(queries?: string[]) {
    try {
      const result = await this.listDocuments(queries);
      const mappedDocuments = result.documents.map((doc) => this.map(doc as Appwritify<Model>));
      return new Success(mappedDocuments);
    } catch (error) {
      console.log(error);
      return new ServerFailure("Appwrite error");
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

  public async delete(id: string) {
    try {
      await this.db.deleteDocument(this.databaseId, this.collectionId, id);
      return new Success("");
    } catch (error) {
      console.log(error);
      return new ServerFailure("Appwrite error");
    }
  }
}
