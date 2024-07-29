import { Client, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

const storage = new Storage(client);

export { client, storage };
export { ImageFormat } from "appwrite";
