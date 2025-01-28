import { testAdminEmail } from "@/lib/constants";
import { users } from "@/server/adapters/appwrite/nodeClient";
import { Query } from "node-appwrite";

async function deleteAllUsers() {
  try {
    const result = await users.list([Query.notEqual("email", testAdminEmail)]);
    for (const user of result.users) {
      await users.delete(user.$id);
    }

    console.log("All users except admin deleted");
  } catch (error) {
    console.log(error);
  }
  // await users.delete
}

deleteAllUsers();
