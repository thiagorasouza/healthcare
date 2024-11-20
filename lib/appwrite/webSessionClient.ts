import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { Account, Client } from "appwrite";

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(env.projectId);

const getAccount = () => {
  const sessionCookie = cookies().get("session");
  if (!sessionCookie) {
    throw new Error("Session cookie is not set.");
  }

  client.setSession(sessionCookie.value);

  return new Account(client);
};

export { client, getAccount };
