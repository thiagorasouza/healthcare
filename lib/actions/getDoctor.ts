import { databases, users } from "@/lib/appwrite/adminClient";
import { success, unexpectedError } from "@/lib/results";

export async function getDoctor(doctorId: string) {
  try {
    const doctor = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTORS_COLLECTION_ID!,
      doctorId,
    );

    const user = await users.get(doctor.authId);

    return success({ doctor, user });
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
