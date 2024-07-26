import { NextRequest } from "next/server";
import { Client } from "node-appwrite";

export const getNodeSessionClient = (request: NextRequest) => {
  const sessionClient = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.PROJECT_ID!);

  const sessionCookie = request.cookies.get("session");
  if (sessionCookie) {
    sessionClient.setSession(sessionCookie.value);
  }

  return sessionClient;
};
