import { getAccount } from "@/server/adapters/appwrite/webClient";

export async function isTestingUser() {
  const account = await getAccount();
  const user = await account.get();
  return user.labels.includes("testing");
}
