import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { Account, Client } from "appwrite";

export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(env.projectId);

export async function getAccount() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    throw new Error("Session cookie is not set.");
  }

  client.setSession(sessionCookie.value);

  return new Account(client);
}
