import * as sdk from "node-appwrite";

const client = new sdk.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

const account = new sdk.Account(client);
const databases = new sdk.Databases(client);

export { client, account, databases };
export { AppwriteException } from "node-appwrite";
