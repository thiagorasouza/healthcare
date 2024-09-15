import { env } from "@/lib/env";
import { Account, Client, Databases, Storage, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(env.projectId)
  .setKey(process.env.API_KEY!);

const account = new Account(client);
const users = new Users(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, users, account, databases, storage };
export { AppwriteException, ID, Permission, Role, Query, Databases } from "node-appwrite";
