"use server";

import { databases, users } from "@/lib/appwrite/adminClient";
import { success, unexpectedError } from "@/lib/results";
import { DoctorDocumentSchema, UserDocumentSchema } from "@/lib/schemas/appwriteSchema";

export async function getDoctor(doctorId: string) {
  try {
    const doctorDocument: DoctorDocumentSchema = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.DOCTORS_COLLECTION_ID!,
      doctorId,
    );

    const userDocument: UserDocumentSchema = await users.get(doctorDocument.authId);

    const doctor = {
      doctorId: doctorDocument.$id,
      authId: userDocument.$id,
      name: userDocument.name,
      email: userDocument.email,
      phone: userDocument.phone,
      specialty: doctorDocument.specialty,
      bio: doctorDocument.bio,
      pictureId: doctorDocument.pictureId,
    };

    return success(doctor);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
