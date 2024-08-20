import { env } from "@/lib/env";
import { Client, Storage } from "appwrite";

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject(env.projectId);

const storage = new Storage(client);

export { client, storage };
export { ImageFormat } from "appwrite";
