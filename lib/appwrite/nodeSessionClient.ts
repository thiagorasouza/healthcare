import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

export const getNodeSessionClient = () => {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID!);

  const sessionCookie = cookies().get("session");
  if (!sessionCookie) {
    throw new Error("Session cookie is not set.");
  }

  client.setSession(sessionCookie.value);
  const account = new Account(client);

  return { client, account };
};