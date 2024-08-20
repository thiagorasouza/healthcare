import { users } from "@/lib/appwrite/adminClient";
import { testAdminEmail } from "@/lib/constants";
import { Query } from "node-appwrite";

async function deleteAllUsers() {
  try {
    const result = await users.list([Query.notEqual("email", testAdminEmail)]);
    for (const user of result.users) {
      await users.delete(user.$id);
    }

    console.log("All users except admin deleted");
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
  // await users.delete
}

deleteAllUsers();
