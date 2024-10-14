import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(env.projectId);

const sessionCookie = cookies().get("session");
if (!sessionCookie) {
  throw new Error("Session cookie is not set.");
}

client.setSession(sessionCookie.value);
const account = new Account(client);

export { client, account };
