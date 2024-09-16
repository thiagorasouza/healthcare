import { isAppwriteException } from "@/server/frameworks/appwrite/appwriteHelpers";
import { Databases, ID } from "node-appwrite";

export class AppwriteRepository {
  private readonly db: Databases;
  private readonly databaseId: string;
  private readonly collectionId: string;

  constructor(databases: Databases, databaseId: string, collectionId: string) {
    this.db = databases;
    this.databaseId = databaseId;
    this.collectionId = collectionId;
  }

  public async createDocument(data: any, permissions?: string[]) {
    return await this.db.createDocument(
      this.databaseId,
      this.collectionId,
      ID.unique(),
      data,
      permissions,
    );
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
