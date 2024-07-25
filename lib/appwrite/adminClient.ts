import * as sdk from "node-appwrite";

const client = new sdk.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

const account = new sdk.Account(client);

export { client, account };
export { AppwriteException } from "node-appwrite";
